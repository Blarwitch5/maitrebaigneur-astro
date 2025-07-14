import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState } from 'react';

import SubmitBtn from './SubmitBtn.tsx';
import HoneyPot from '@components/forms/HoneyPot/HoneyPot.tsx';
import SubmissionStatusModal from '@components/forms/SubmissionStatusModal/SubmissionStatusModal.tsx';
import { FORMCARRY_ENDPOINTS, submitForm, validateEndpoints } from '../../utils/formcarry.js';

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Le nom doit contenir minimum 2 lettres.' })
    .max(30, {
      message: 'Le nom ne doit pas excéder 30 lettres.',
    })
    .regex(
      /^[a-zA-Z- ]+$/,
      'Le nom ne doit contenir que des lettres, des tirets (-) et/ou des espaces'
    ),
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir minimum 2 lettres.' })
    .max(30, {
      message: 'Le prénom ne doit pas excéder 30 lettres.',
    })
    .regex(/^[a-zA-Z-]+$/, 'Le nom ne doit contenir que des lettres ou des tirets (-)'),
  email: z.string().email({
    message: 'Email invalide. Veuillez entrer une adresse mail valide',
  }),
  tel: z
    .string()
    .min(7, {
      message: 'Le numéro de téléphone doit contenir 10 chiffres ou plus',
    })
    .max(15, {
      message: 'Le numéro de téléphone ne doit pas excéder 15 caractères.',
    })
    .regex(
      /^\+?[0-9]+$/,
      "Le numéro de téléphone ne doit contenir que des chiffres et/ou le signe + pour l'indicatif du pays"
    ),
  message: z.string().min(5, {
    message: 'Le message doit contenir un minimum de 5 caractères.',
  }),

  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
  honeypot: z.string().refine((value) => value === '', {
    message: 'Honey pot doit être vide.',
  }),
});

type FormInput = z.infer<typeof FormSchema>;

const ContactForm = () => {
  // Vérification des endpoints
  if (!validateEndpoints()) {
    return (
      <div className="error-message">
        <p>Configuration des endpoints FormCarry manquante. Veuillez contacter l'administrateur.</p>
      </div>
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      firstName: '',
      email: '',
      tel: '',
      message: '',
      honeypot: '',
      rgpd: false,
    },
  });
  const onSubmit = async (data: FormInput) => {
    try {
      // Validate using Zod
      FormSchema.parse(data);

      if (!FORMCARRY_ENDPOINTS.CONTACT) {
        console.error('Endpoint CONTACT manquant');
        setIsSubmissionSuccessful(false);
        setIsModalOpen(true);
        return;
      }

      const result = await submitForm(FORMCARRY_ENDPOINTS.CONTACT, data);

      if (result.success) {
        setIsSubmissionSuccessful(true);
        reset();
      } else {
        console.error('Erreur de soumission:', result.error);
        setIsSubmissionSuccessful(false);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
      setIsSubmissionSuccessful(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data: FormInput) => {
    if (data.honeypot !== '') {
      console.log('Ceci est une soumission de bot ! Blocage en cours...');

      return;
    }
    onSubmit(data);
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
        role="form"
        aria-labelledby="questions"
        autoComplete="on"
      >
        <fieldset id="questions" className="form__section">
          <legend>Autres questions et suggestions</legend>

          <div className={`form__field ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">
              Nom <span className="required">*</span>
            </label>
            <input id="name" type="text" {...register('name')} autoComplete="family-name" />
            {errors?.name?.message && <p className="error-message">{errors.name.message}</p>}
          </div>
          <div className={`form__field ${errors.firstName ? 'error' : ''}`}>
            <label htmlFor="firstName">
              Prénom <span className="required">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              {...register('firstName')}
              autoComplete="given-name"
            />
            {errors?.firstName?.message && (
              <p className="error-message">{errors.firstName.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.tel ? 'error' : ''}`}>
            <label htmlFor="tel">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <input id="tel" type="tel" {...register('tel')} autoComplete="tel" />
            <small>Exemple: +33612121212, 0033612121212 ou 0612121212</small>
            {errors?.tel?.message && <p className="error-message">{errors.tel.message}</p>}
          </div>
          <div className={`form__field ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              Adresse mail <span className="required">*</span>
            </label>
            <input id="email" type="email" {...register('email')} autoComplete="email" />
            {errors?.email?.message && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className={`form__field col-100 ${errors.message ? 'error' : ''}`}>
            <label htmlFor="message">
              Message <span className="required">*</span>
            </label>
            <textarea id="message" rows={3} {...register('message')} autoComplete="off" />
            {errors?.message?.message && <p className="error-message">{errors.message.message}</p>}
          </div>
        </fieldset>
        <fieldset className="form__section rgpd" id="rgpd-section">
          <div className={`form__field col-100 ${errors.rgpd ? 'error' : ''}`}>
            <div className="checkbox-wrapper">
              <input type="checkbox" id="rgpd" {...register('rgpd')} />
              <label htmlFor="rgpd" className="rgpd-label" aria-describedby="rgpd-description">
                En soumettant ce formulaire, j'accepte que les informations saisies dans ce
                formulaire soient utilisées pour permettre de me recontacter. Lire les{' '}
                <a href="/mentions-legales">mentions légales</a>.
              </label>
            </div>
            {errors?.rgpd?.message && <p className="error-message">{errors.rgpd.message}</p>}
          </div>
        </fieldset>
        <HoneyPot />
        <SubmitBtn />
      </form>

      {isModalOpen && (
        <SubmissionStatusModal isSuccess={isSubmissionSuccessful} onClose={closeModal} />
      )}
    </>
  );
};
export default ContactForm;
