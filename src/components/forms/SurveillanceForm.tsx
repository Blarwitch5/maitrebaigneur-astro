import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

import SubmitBtn from './SubmitBtn.tsx';
import HoneyPot from '@components/forms/HoneyPot/HoneyPot.tsx';
import SubmissionStatusModal from '@components/forms/SubmissionStatusModal/SubmissionStatusModal.tsx';
import { FORMCARRY_ENDPOINTS, submitForm, validateEndpoints } from '../../utils/formcarry.js';

const SurveillanceFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Le nom doit contenir minimum 2 lettres.' })
    .max(30, {
      message: 'Le nom ne doit pas excéder 30 lettres.',
    })
    .regex(
      /^[a-zA-ZÀ-ÿ\- ]+$/,
      'Le nom ne doit contenir que des lettres, des tirets (-) et/ou des espaces'
    ),
  firstName: z
    .string()
    .min(2, { message: 'Le prénom doit contenir minimum 2 lettres.' })
    .max(30, {
      message: 'Le prénom ne doit pas excéder 30 lettres.',
    })
    .regex(/^[a-zA-ZÀ-ÿ\- ]+$/, 'Le prénom ne doit contenir que des lettres, des tirets (-) et/ou des espaces'),
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
  info: z.string().min(10, {
    message: 'Les informations doivent contenir un minimum de 10 caractères.',
  }),
  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
  honeypot: z.string().refine((value) => value === '', {
    message: 'Honey pot doit être vide.',
  }),
});

type SurveillanceFormInput = z.infer<typeof SurveillanceFormSchema>;

const SurveillanceForm = () => {
  if (!validateEndpoints()) {
    return (
      <div className="error-message">
        <p>Configuration des endpoints FormCarry manquante. Veuillez contacter l'administrateur.</p>
      </div>
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  const onSubmit = async (data: SurveillanceFormInput) => {
    try {
      if (!FORMCARRY_ENDPOINTS.EVENT) {
        console.error('Endpoint EVENT manquant');
        setIsSubmissionSuccessful(false);
        setIsModalOpen(true);
        return;
      }

      const result = await submitForm(FORMCARRY_ENDPOINTS.EVENT, data);

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

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SurveillanceFormInput>({
    resolver: zodResolver(SurveillanceFormSchema),
    defaultValues: {
      name: '',
      firstName: '',
      email: '',
      tel: '',
      info: '',
      honeypot: '',
      rgpd: false,
    },
  });

  const handleFormSubmit = (data: SurveillanceFormInput) => {
    if (data.honeypot !== '') {
      return;
    }
    onSubmit(data);
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
        aria-labelledby="surveillance-legend"
        autoComplete="on"
      >
        <fieldset className="form__section" id="events">
          <legend id="surveillance-legend">Contact pour de la surveillance</legend>

          <div className={`form__field ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">
              Nom <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text"
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              {...register('name')}
              autoComplete="family-name"
            />
            {errors?.name?.message && (
              <p id="name-error" className="error-message" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className={`form__field ${errors.firstName ? 'error' : ''}`}>
            <label htmlFor="firstName">
              Prénom <span className="required">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              aria-required="true"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? 'firstName-error' : undefined}
              {...register('firstName')}
              autoComplete="given-name"
            />
            {errors?.firstName?.message && (
              <p id="firstName-error" className="error-message" role="alert">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className={`form__field ${errors.tel ? 'error' : ''}`}>
            <label htmlFor="tel">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <input
              id="tel"
              type="tel"
              aria-required="true"
              aria-invalid={!!errors.tel}
              aria-describedby={`tel-hint${errors.tel ? ' tel-error' : ''}`}
              {...register('tel')}
              autoComplete="tel"
            />
            <small id="tel-hint">Exemple: +33612121212, 0033612121212 ou 0612121212</small>
            {errors?.tel?.message && (
              <p id="tel-error" className="error-message" role="alert">
                {errors.tel.message}
              </p>
            )}
          </div>

          <div className={`form__field ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              Adresse mail <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              {...register('email')}
              autoComplete="email"
            />
            {errors?.email?.message && (
              <p id="email-error" className="error-message" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className={`form__field col-100 ${errors.info ? 'error' : ''}`}>
            <label htmlFor="info">
              Où ? Quand ? Et combien de personnes ? Quel type d'événement ?{' '}
              <span className="required">*</span>
            </label>
            <textarea
              id="info"
              rows={3}
              aria-required="true"
              aria-invalid={!!errors.info}
              aria-describedby={`info-hint${errors.info ? ' info-error' : ''}`}
              {...register('info')}
              autoComplete="off"
            />
            <small id="info-hint">
              Exemple: Je souhaite organiser un aquaversaire à Aix le 01/01/23 pour 10 enfants...
            </small>
            {errors?.info?.message && (
              <p id="info-error" className="error-message" role="alert">
                {errors.info.message}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="form__section rgpd" id="rgpd-section">
          <div className={`form__field col-100 ${errors.rgpd ? 'error' : ''}`}>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rgpd"
                aria-required="true"
                aria-invalid={!!errors.rgpd}
                aria-describedby={errors.rgpd ? 'rgpd-error' : undefined}
                {...register('rgpd')}
              />
              <label htmlFor="rgpd" className="rgpd-label">
                En soumettant ce formulaire, j'accepte que les informations saisies dans ce
                formulaire soient utilisées pour permettre de me recontacter. Lire les{' '}
                <a href="/mentions-legales">mentions légales</a>.
              </label>
            </div>
            {errors?.rgpd?.message && (
              <p id="rgpd-error" className="error-message" role="alert">
                {errors.rgpd.message}
              </p>
            )}
          </div>
        </fieldset>

        <HoneyPot register={register} />
        <SubmitBtn isSubmitting={isSubmitting} />
      </form>

      {isModalOpen && (
        <SubmissionStatusModal isSuccess={isSubmissionSuccessful} onClose={closeModal} />
      )}
    </>
  );
};
export default SurveillanceForm;
