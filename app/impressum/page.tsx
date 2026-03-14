'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SITE_OWNER } from '@/lib/site-owner';

const impressumContent = {
  ru: {
    title: 'Правовая информация',
    backToHome: 'Вернуться на главную',
    impressum: 'Сведения об операторе персональных данных',
    accordingTo: 'Документ составлен с учетом требований ФЗ-152 "О персональных данных".',
    nameLabel: 'Оператор персональных данных:',
    name: SITE_OWNER.name,
    phoneLabel: 'Телефон:',
    phone: SITE_OWNER.phone,
    emailLabel: 'Электронная почта:',
    email: SITE_OWNER.email,
    responsibleLabel: 'Юридическая информация:',
    legalText:
      'Сайт предназначен для сбора анкет с целью обратной связи и консультации. Отправляя анкету, пользователь подтверждает согласие на обработку персональных данных в соответствии с Политикой обработки персональных данных.',
  },
  en: {
    title: 'Legal Information',
    backToHome: 'Back to home',
    impressum: 'Personal Data Operator Information',
    accordingTo: 'This page follows Russian Federal Law No. 152-FZ "On Personal Data".',
    nameLabel: 'Personal Data Operator:',
    name: SITE_OWNER.name,
    phoneLabel: 'Phone:',
    phone: SITE_OWNER.phone,
    emailLabel: 'E-mail:',
    email: SITE_OWNER.email,
    responsibleLabel: 'Legal Information:',
    legalText:
      'The website collects questionnaire data for feedback and consultation purposes. By submitting a form, the user agrees to personal data processing according to the Privacy Policy.',
  },
};

export default function ImpressumPage() {
  const { language } = useLanguage();
  const currentLanguage = language || 'ru';
  const content = impressumContent[currentLanguage] || impressumContent.ru;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            <Home className="w-4 h-4" />
            {content.backToHome}
          </Link>
        </div>

        <div className="card-wellness space-y-6">
          <h1 className="text-3xl font-bold text-foreground">{content.title}</h1>
          
          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-xl font-semibold mb-4">{content.impressum}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                {content.accordingTo}
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.nameLabel}</h3>
              <p>{content.name}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.phoneLabel}</h3>
              <p>{content.phone}</p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">{content.emailLabel}</h3>
              <p>
                <a 
                  href={`mailto:${content.email}`}
                  className="text-primary hover:underline"
                >
                  {content.email}
                </a>
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-2">
                {content.responsibleLabel}
              </h3>
              <p>{content.legalText}</p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
