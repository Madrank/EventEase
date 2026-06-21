import nodemailer from 'nodemailer';
import { config } from '../config';
import { logger } from '../config/logger';

export class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  private async getTransporter(): Promise<nodemailer.Transporter> {
    if (this.transporter) return this.transporter;

    if (config.smtp.user && config.smtp.pass) {
      this.transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });
    } else {
      logger.warn('SMTP non configuré, utilisation d\'un transporteur fictif');
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    return this.transporter;
  }

  async sendInvitation(to: string, eventName: string, rsvpLink: string) {
    const transporter = await this.getTransporter();

    const info = await transporter.sendMail({
      from: '"EventEase" <noreply@eventease.com>',
      to,
      subject: `Vous êtes invité à "${eventName}"`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7C3AED;">EventEase</h1>
          <h2>Vous êtes invité !</h2>
          <p>Vous avez été invité à l'événement : <strong>${eventName}</strong></p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${rsvpLink}" style="background-color: #7C3AED; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              Répondre à l'invitation
            </a>
          </div>
          <p style="color: #666; font-size: 12px;">
            Cet email a été envoyé via EventEase - Organisateur d'événements
          </p>
        </div>
      `,
    });

    logger.info(`Email envoyé à ${to}: ${info.messageId}`);
    if (info.messageId) {
      logger.info(`URL de preview: ${nodemailer.getTestMessageUrl(info)}`);
    }

    return info;
  }

  async sendContributionConfirmation(to: string, eventName: string, amount: number) {
    const transporter = await this.getTransporter();

    const info = await transporter.sendMail({
      from: '"EventEase" <noreply@eventease.com>',
      to,
      subject: `Confirmation de votre contribution - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #7C3AED;">EventEase</h1>
          <h2>Merci pour votre contribution !</h2>
          <p>Votre contribution de <strong>${amount.toFixed(2)} €</strong> pour l'événement <strong>${eventName}</strong> a bien été enregistrée.</p>
          <p style="color: #666; font-size: 12px;">
            Cet email a été envoyé via EventEase - Organisateur d'événements
          </p>
        </div>
      `,
    });

    logger.info(`Email de confirmation envoyé à ${to}: ${info.messageId}`);
    return info;
  }
}

export const emailService = new EmailService();
