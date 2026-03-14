'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ShieldCheck } from 'lucide-react';
import { SITE_OWNER } from '@/lib/site-owner';

interface PrivacyPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyDialog: React.FC<PrivacyPolicyDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { language } = useLanguage();

  const privacyPolicy = {
    ru: {
      title: 'Политика обработки персональных данных',
      sections: [
        {
          title: '1. Оператор персональных данных',
          content: `Оператор: ${SITE_OWNER.name}. Контактные данные оператора: телефон ${SITE_OWNER.phone}, электронная почта ${SITE_OWNER.email}.`,
        },
        {
          title: '2. Правовое основание обработки',
          content:
            'Обработка персональных данных осуществляется на основании Федерального закона от 27.07.2006 N 152-ФЗ "О персональных данных" и согласия субъекта персональных данных, выраженного при отправке анкеты.',
        },
        {
          title: '3. Состав персональных данных',
          content:
            'Обрабатываются данные, указанные пользователем в анкете: имя, возраст, сведения о состоянии здоровья, ответы на вопросы анкеты, а также контактные данные для связи (Telegram, Instagram, телефон и иные предоставленные пользователем данные).',
        },
        {
          title: '4. Цели обработки персональных данных',
          content:
            'Цель обработки: обратная связь с пользователем и предоставление консультации на основании полученной анкеты. Персональные данные не используются для принятия полностью автоматизированных решений.',
        },
        {
          title: '5. Хранение, срок и защита данных',
          content:
            'Оператор принимает необходимые организационные и технические меры для защиты персональных данных от неправомерного доступа, изменения, раскрытия или уничтожения. Данные хранятся в объеме и сроке, необходимом для достижения цели консультации и обратной связи.',
        },
        {
          title: '6. Передача данных третьим лицам',
          content:
            'Данные могут передаваться только в объеме, необходимом для технической доставки анкеты оператору (например, через API Telegram). Иная передача третьим лицам без законных оснований не осуществляется.',
        },
        {
          title: '7. Права субъекта персональных данных',
          content:
            'Пользователь вправе запросить уточнение, блокирование или удаление своих персональных данных, а также отозвать согласие на обработку, направив обращение оператору по контактам, указанным выше.',
        },
        {
          title: '8. Согласие пользователя',
          content:
            'При отправке анкеты пользователь подтверждает согласие на обработку персональных данных. Ссылка на данную политику и согласие доступна в форме перед отправкой анкеты.',
        },
      ],
    },
    en: {
      title: 'Privacy Policy',
      sections: [
        {
          title: '1. Personal Data Operator',
          content: `Operator: ${SITE_OWNER.name}. Contacts: ${SITE_OWNER.phone}, ${SITE_OWNER.email}.`,
        },
        {
          title: '2. Legal Basis',
          content:
            'Personal data is processed under user consent and according to Russian Federal Law No. 152-FZ "On Personal Data".',
        },
        {
          title: '3. Data Categories',
          content:
            'We process only data provided by the user in the questionnaire: health-related answers and contact details for feedback.',
        },
        {
          title: '4. Purpose of Processing',
          content:
            'Purpose: feedback and consultation based on the submitted questionnaire.',
        },
        {
          title: '5. Storage and Security',
          content:
            'The operator applies organizational and technical measures to protect personal data and keeps it only as long as needed for consultation and feedback.',
        },
        {
          title: '6. Data Transfer',
          content:
            'Data may be transferred only for technical delivery to the operator (for example, via Telegram API).',
        },
        {
          title: '7. User Rights',
          content:
            'The user may request clarification, blocking, or deletion of personal data and may withdraw consent by contacting the operator.',
        },
        {
          title: '8. User Consent',
          content:
            'By submitting the form, the user confirms consent to personal data processing; this policy is available in the form before submission.',
        },
      ],
    },
  };

  const policy = privacyPolicy[language];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {policy.title}
          </DialogTitle>
          <DialogDescription>
            {language === 'ru'
              ? 'Информация о сборе и обработке персональных данных'
              : 'Information about collection and processing of personal data'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {policy.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h3 className="font-semibold text-foreground text-base">{section.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

