import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

interface IEmailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(options: IEmailOptions) {
    try {
      await this.mailerService.sendMail({
        to: options.to,
        subject: options.subject,
        template: options.template,
        context: options.context,
      });
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  async sendPasswordResetLink(email: string, token: string) {
    return await this.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: './password-reset',
      context: {
        name: email,
        email,
        resetLink: `http://localhost:3000/reset-password?token=${token}`,
      },
    });
  }

  async sendVerificationCode(email: string, code: string) {
    return await this.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: './verification-code',
      context: {
        name: email,
        code,
      },
    });
  }
}
