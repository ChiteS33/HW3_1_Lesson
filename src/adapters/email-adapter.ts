import nodemailer from "nodemailer";
import {injectable} from "inversify";

@injectable()
export class EmailAdapter {
     async sendEmail(email: string, subject: string, code: string): Promise<any> {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "balbesik077@gmail.com",       // email от кого будет высылаться сообщение
                pass: "twrkcsuztbecznxb",                           // pass
            },
        });
          await transporter.sendMail({
            from: "Tolyan",
            to: email,                  // Кому отправляем
            subject: subject,           // Заголовок
            html: `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${code}'>complete registration</a>
 </p>`,              // Текст
        })

    }

    async resendEmail(email: string, recoveryCode: string): Promise<any> {
         let transporter = nodemailer.createTransport({
             service: 'gmail',
             auth: {
                 user: "balbesik077@gmail.com",
                 pass: "twrkcsuztbecznxb",
             },
         });
         await transporter.sendMail({
             from: "Zlidnya",
             to: email,
             subject: "WoW",
             html: `<h1>Password recovery</h1>
             <p>To finish password recovery please follow the link below:
            <a href='https://somesite.com/password-recovery?recoveryCode=${recoveryCode}'>recovery password</a>
        </p>`,
         })


    }





}