import {
  NotFoundError,
  AuthError,
  SendEmailError,
  ValidationError,
  NetworkError,
  RegisterError,
} from '/utils/error'
import regexemail from '/utils/regexemail'
import jwt from 'jsonwebtoken'
import { findEmailUserbyId, finduserbyemail } from '/models/users/users'
import bcrypt from 'bcryptjs'
import { updatepassindb } from '/models/users/resetpassword'
import { expiringResetToken } from '/models/users/resetpassword'
import regexsenha from '/utils/regexsenha'
import { sendLoginNotification } from '/utils/sendEmail'
import { validationresettoken } from '/models/users/resetpassword'
import { registerUserInDB } from '/models/users/users'

export async function login(email, senha) {
  let emailtolower = email.toLowerCase()
  console.log(emailtolower, senha)
  try {
    let sml = regexsenha(senha)
    if (!sml) {
      throw new ValidationError(
        'invalid password, min 4 carac and with 1 uppercase'
      )
    }
    let eml = regexemail(email)
    console.log(eml)
    if (!eml) {
      throw new ValidationError('invalid email')
    } else {
      const result = await finduserbyemail(emailtolower)

      if (result.length > 0) {
        const user = result[0]
        const passwordMatch = await bcrypt.compare(senha, user.senha)
        console.log(passwordMatch)

        if (passwordMatch) {
          const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          )
          try {
            let ok = await sendLoginNotification(
              user.email,
              'Notificação de Login - MyShop',
              `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá, ${user.nome} 👋</h2>
              <p style="color:#e3f2fd;">Você acabou de fazer login na sua conta <b>MyShop</b>.</p>
            </div>
          `
            )
            if (ok == true) {
              console.log('email enviado com sucesso')
            }
          } catch (error) {
            throw new NetworkError('erro ao enviar email de login!', error)
          }
          return { user, token }
        } else {
          throw new AuthError('email or password invalid')
        }
      } else {
        throw new NotFoundError('User not found')
      }
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new NetworkError(error)
  }
}
export async function updatepassword(key, newpassword) {
  console.log('teste da funçao updatepassword')
  try {
    const result = await validationresettoken(key)
    console.log('teste de result', result.rows)
    console.log('teste de result')
    if (result.length > 0) {
      const userId = result[0].usuariosid
      const hashedPassword = await bcrypt.hash(newpassword, 10)
      const UpdatePassInDB = await updatepassindb(hashedPassword, userId)
      console.log('teste de updatepassindb', UpdatePassInDB)

      if (UpdatePassInDB.length > 0) {
        await expiringResetToken(userId)
        const emailResult = await findEmailUserbyId(userId)
        console.log('teste de emailresult', emailResult[0])
        if (emailResult.length > 0) {
          try {
            let ok = await sendLoginNotification(
              emailResult[0].email,
              'Notificação de Alteração de Senha - MyShop',
              `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá,</h2>
              <p style="color:#e3f2fd;">Sua senha da conta <b>MyShop</b> foi alterada com sucesso.</p>
            </div>
          `
            )
            if (!ok) {
              throw new SendEmailError(
                'erro ao enviar email de log sobre alteração de  senha'
              )
            }
            return true
          } catch (error) {
            console.log('Error sending password change email:', error)
          }
        } else {
          console.log('Error fetching user email:')
        }

        return true
      } else {
        throw new AuthError('Failed to update password')
      }
    } else {
      throw new Error('Invalid or expired reset key')
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw new Error('Failed to reset password')
  }
}
async function validation_user(nome, email, senha) {
  let error = []

  if (nome.length < 4) {
    error.push(
      new RegisterError('nome', 'username they have must 4 lengths a more')
    )
  }
  if (senha.length < 6) {
    error.push(
      new RegisterError('senha', 'Password invalid email 6 lengths a more')
    )
  }
  let allowed_emails = [
    '@',
    'hotmail.com',
    'hotmail.com.br',
    'gmail.com.br',
    'gmail.com',
    'outlook.com',
    'outlook.com.br',
  ]
  let regexEmail = new RegExp(
    `^[a-zA-Z0-9._%+-]+@(${allowed_emails.map((domain) => domain.replace('.', '\\.')).join('|')})$`
  )
  if (!regexEmail.test(email)) {
    error.push(new RegisterError('email', 'invalid email'))
  }
  if (error.length > 0) {
    return { success: false, error }
  } else {
    return { success: true }
  }
}

export async function registeruser(nome, email, senha) {
  try {
    let emailtolower = email.toLowerCase().trim()
    console.log(emailtolower)

    let errors = await validation_user(nome, emailtolower, senha)
    if (errors.success == false) {
      return errors
    } else {
      const hashedPassword = await bcrypt.hash(senha, 10)
      const result = await registerUserInDB(nome, emailtolower, hashedPassword)
      if (result) {
        const token = await jwt.sign(
          { email, nome, role: 'USER', id: result.id },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        )
        return token
      }
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}
