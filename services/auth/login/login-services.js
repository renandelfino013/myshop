import { finduserbyemail } from "models/users/users";
import { sendEmailNotification } from "utils/mail/sendEmail";
import jwt from "jsonwebtoken";
import assertFound from "utils/helper/assertFound";
import comparePassword from "utils/helper/auth/comparePassword";
export async function login(email, senha) {
  const result = await finduserbyemail(email);
  assertFound(result, "user");

  const user = result[0];
  await comparePassword(senha, user.senha);
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  sendEmailNotification(
    user.email,
    "Notificação de Login - MyShop",
    `
            <div style="font-family: Arial, sans-serif; background-color:#0d47a1; padding:20px; color:#fff;">
              <div style="text-align:center; margin-bottom:20px;">
                <img src="https://img.icons8.com/ios-filled/50/ffffff/shopping-cart.png" alt="MyShop" />
              </div>
              <h2 style="margin:0; color:#fff;">Olá, ${user.nome} 👋</h2>
              <p style="color:#e3f2fd;">Você acabou de fazer login na sua conta <b>MyShop</b>.</p>
            </div>
          `,
  );

  return [{ token }];
}
