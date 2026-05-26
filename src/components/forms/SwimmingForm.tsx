import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import levels from '@assets/data/levels.ts';
import SubmitBtn from './SubmitBtn.tsx';
import Notice from '@components/ui/notice/Notice.tsx';
import HoneyPot from '@components/forms/HoneyPot/HoneyPot.tsx';
import SubmissionStatusModal from '@components/forms/SubmissionStatusModal/SubmissionStatusModal.tsx';
import { FORMCARRY_ENDPOINTS, submitForm, validateEndpoints } from '../../utils/formcarry.js';

const LEVEL_SLUGS = [...levels.map((l) => l.slug), 'parent-enfant'] as const;
const PARENT_ENFANT = {
  slug: 'parent-enfant',
  name: 'Parent-enfant',
  desc: "Pour les enfants de moins de 3 ans accompagnés d'un parent. Découverte de l'eau en toute sécurité et complicité.",
  hints: ["Mon enfant a moins de 3 ans ?", "Je souhaite accompagner mon enfant dans l'eau ?"],
};

const swimmerSchema = z.object({
  name: z
    .string()
    .min(2, 'Le nom doit contenir minimum 2 lettres.')
    .max(50, 'Le nom ne doit pas excéder 50 lettres.')
    .regex(
      /^[a-zA-ZÀ-ÿ\- ]+$/,
      'Le nom ne doit contenir que des lettres, des tirets (-) et/ou des espaces'
    ),
  dob: z
    .string()
    .min(10, "La date de naissance doit être au format date (ex. 'jj/mm/aaaa')")
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "La date de naissance doit être au format date (ex. 'jj/mm/aaaa')"
    ),
  level: z
    .string()
    .refine((value) => value !== '' && value !== undefined, {
      message: 'Veuillez sélectionner un niveau.',
    })
    .refine((value) => (LEVEL_SLUGS as readonly string[]).includes(value), {
      message: 'Niveau invalide.',
    }),
});
const SwimmingFormSchema = z.object({
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
  address: z
    .string()
    .min(4, { message: "L'adresse doit contenir un minimum de 4 caractères." })
    .max(100, { message: "L'adresse ne peut pas excéder 100 caractères" })
    .regex(
      /^[a-zA-ZÀ-ÿ0-9,\- ]+$/,
      "L'adresse ne peut contenir que des lettres, chiffres et des tirets (-)"
    ),
  zipCode: z
    .string()
    .min(4, { message: 'Le code postal doit avoir un minimum de 4 chiffres.' })
    .max(5, { message: 'Le code postal ne doit pas excéder 5 chiffres.' })
    .regex(/^[0-9]+$/, 'Le code postal doit être composé de chiffres uniquement;')
    .refine((value) => value.startsWith('13') || value.startsWith('84'), {
      message: 'Seules les adresses des départements 13 et 84 sont acceptées.',
    }),
  city: z
    .string()
    .min(2, {
      message: 'La nom de la ville doit contenir un minimum de 2 caractères.',
    })
    .max(35, {
      message: 'Le nom de la ville ne doit pas excéder 35 caractères',
    })
    .regex(
      /^[a-zA-ZÀ-ÿ\- ]+$/,
      'Le nom de la ville ne peut contenir que des lettres, des tirets (-) et des espaces'
    ),

  dispo: z.string().min(10, {
    message: 'Les informations sur les disponibilités doivent contenir un minim de 10 caractères.',
  }),
  numSwimmers: z.enum(['1', '2', '3']),
  swimmers: z.array(swimmerSchema),
  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
  honeypot: z.string().refine((value) => value === '', {
    message: 'Honey pot doit être vide.',
  }),
});

type SwimmingFormInput = z.infer<typeof SwimmingFormSchema>;

const SwimmingForm = () => {
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
  const [numSwimmers, setNumSwimmers] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SwimmingFormInput>({
    resolver: zodResolver(SwimmingFormSchema),
    defaultValues: {
      name: '',
      firstName: '',
      email: '',
      address: '',
      zipCode: '',
      city: '',
      tel: '',
      dispo: '',
      swimmers: [{ name: '', dob: '', level: '' }],
      honeypot: '',
      rgpd: false,
    },
  });
  const watchedSwimmers = watch('swimmers');

  const onSubmit = async (data: SwimmingFormInput) => {
    try {
      // Create a formatted list of swimmers
      const formattedSwimmersList = data.swimmers.map((swimmer, index) => {
        return `
          Baigneur ${index + 1}:\n
          - Nom: ${swimmer.name}\n
          - Date de naissance: ${swimmer.dob}\n
          - Niveau: ${swimmer.level}\n
       
        `;
      });

      const formattedSwimmers = formattedSwimmersList.join('\n');

      const formattedData = {
        ...data,
        swimmers: formattedSwimmers,
      };

      if (!FORMCARRY_ENDPOINTS.SWIMMING) {
        console.error('Endpoint SWIMMING manquant');
        setIsSubmissionSuccessful(false);
        setIsModalOpen(true);
        return;
      }

      const result = await submitForm(FORMCARRY_ENDPOINTS.SWIMMING, formattedData);

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

  const handleFormSubmit = (data: SwimmingFormInput) => {
    if (data.honeypot !== '') {
      return;
    }
    onSubmit(data);
  };

  const handleNumSwimmersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNumSwimmers(Number.parseInt(e.target.value, 10));
  };

  const getLevelInfo = (slug: string) => {
    if (slug === 'parent-enfant') return PARENT_ENFANT;
    return levels.find((l) => l.slug === slug) ?? null;
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
        autoComplete="on"
        aria-labelledby="swimming-lessons"
      >
        <fieldset className="form__section" id="swimming-lessons">
          <legend id="swimming-lessons-legend">Contact pour leçons de natation à domicile</legend>
          <div className={`form__field col-100 ${errors.name ? 'error' : ''}`}>
            <label htmlFor="name">
              Nom d'un parent <span className="required">*</span>
            </label>
            <input
              type="text"
              title="Nom d'un parent"
              id="name"
              {...register('name')}
              autoComplete="family-name"
            />
            {errors?.name?.message && <p className="error-message">{errors.name.message}</p>}
          </div>
          <div className={`form__field col-100 ${errors.firstName ? 'error' : ''}`}>
            <label htmlFor="firstName">
              Prénom de ou des enfants <span className="required">*</span>
            </label>
            <input
              title="Prénom de ou des enfants"
              type="text"
              id="firstName"
              {...register('firstName')}
              autoComplete="given-name"
            />
            <small>Dans le cas de plusieurs enfants, séparer les prénoms par une virgule</small>
            {errors?.firstName?.message && (
              <p className="error-message">{errors.firstName.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.tel ? 'error' : ''}`}>
            <label htmlFor="tel">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <input
              title="Numéro de téléphone"
              id="tel"
              type="tel"
              {...register('tel')}
              autoComplete="tel"
            />
            <small>Exemple: +33612121212, 0033612121212 ou 0612121212</small>

            {errors?.tel?.message && <p className="error-message">{errors.tel.message}</p>}
          </div>
          <div className={`form__field ${errors.email ? 'error' : ''}`}>
            <label htmlFor="email">
              Adresse mail <span className="required">*</span>
            </label>
            <input
              title="Adresse mail"
              id="email"
              type="email"
              {...register('email')}
              autoComplete="email"
            />
            {errors?.email?.message && <p className="error-message">{errors.email.message}</p>}
          </div>
          <div className={`form__field col-100 ${errors.address ? 'error' : ''}`}>
            <label htmlFor="address">
              Adresse de la piscine <span className="required">*</span>
            </label>
            <input
              id="address"
              title="Adresse de la piscine"
              type="text"
              {...register('address')}
              autoComplete="street-address"
            />
            {errors?.address?.message && <p className="error-message">{errors.address.message}</p>}
          </div>
          <div className={`form__field ${errors.zipCode ? 'error' : ''}`}>
            <label htmlFor="zipCode">
              Code postal <span className="required">*</span>
            </label>
            <input
              id="zipCode"
              placeholder="13100"
              type="text"
              pattern="\d{5}"
              title="Code postal français à 5 chiffres"
              {...register('zipCode')}
              autoComplete="postal-code"
            />
            {errors?.zipCode?.message && <p className="error-message">{errors.zipCode.message}</p>}
          </div>
          <div className={`form__field ${errors.city ? 'error' : ''}`}>
            <label htmlFor="city">
              Ville <span className="required">*</span>
            </label>
            <input
              id="city"
              title="city"
              placeholder=""
              type="text"
              {...register('city')}
              autoComplete="address-level2"
            />
            {errors?.city?.message && <p className="error-message">{errors.city.message}</p>}
          </div>
          <div className={`form__field col-100 ${errors.dispo ? 'error' : ''}`}>
            <label htmlFor="dispo">
              Quand voudriez-vous réserver un cours ?<span className="required">*</span>
            </label>
            <textarea id="dispo" rows={5} {...register('dispo')} autoComplete="off" />
            <small>Veuillez nous fournir plusieurs dates et heures</small>
            {errors?.dispo?.message && <p className="error-message">{errors.dispo.message}</p>}
          </div>
          <Notice
            className="col-100"
            type="info"
            message="Nous ne garantissons pas la réservation de vos créneaux mais nous
          ferons de notre mieux pour vous répondre favorablement."
          />
          {/* Select field for the number of swimmers */}
          <div className="form__field col-100">
            <label htmlFor="numSwimmers">Nombre de nageurs</label>
            <select
              id="numSwimmers"
              {...register('numSwimmers')}
              onChange={handleNumSwimmersChange}
              value={numSwimmers}
            >
              <option value="1">1 nageur</option>
              <option value="2">2 nageurs</option>
              <option value="3">3 nageurs</option>
            </select>
          </div>
          <div className="col-100 ">
            {[0, 1, 2].map(
              (index) =>
                index < numSwimmers && (
                  <div className="fieldgroup" key={`swimmer-${index}`}>
                    <div>
                      <p className="fieldgroup__title">Baigneur {index + 1}</p>
                      <div
                        className={`form__field ${errors?.swimmers?.[index]?.name ? 'error' : ''}`}
                      >
                        <label htmlFor={`swimmers.${index}.name`}>Nom du nageur {index + 1}</label>
                        <input
                          type="text"
                          id={`swimmers.${index}.name`}
                          {...register(`swimmers.${index}.name`)}
                          autoComplete="name"
                        />
                        {errors?.swimmers?.[index]?.name && (
                          <p className="error-message">
                            {errors?.swimmers?.[index]?.name?.message ?? ''}
                          </p>
                        )}
                      </div>
                      <div
                        className={`form__field ${errors?.swimmers?.[index]?.dob ? 'error' : ''}`}
                      >
                        <label htmlFor={`swimmers.${index}.dob`}>
                          Date de naissance du nageur {index + 1}
                        </label>
                        <input
                          type="date"
                          id={`swimmers.${index}.dob`}
                          {...register(`swimmers.${index}.dob` as const)}
                          autoComplete="bday"
                        />
                        {errors?.swimmers?.[index]?.dob && (
                          <p className="error-message">{errors.swimmers?.[index]?.dob?.message}</p>
                        )}
                      </div>
                      <div
                        className={`form__field ${errors?.swimmers?.[index]?.level ? 'error' : ''}`}
                      >
                        <label htmlFor={`swimmers.${index}.level`}>
                          Niveau du nageur {index + 1}
                        </label>
                        <select
                          id={`swimmers.${index}.level`}
                          {...register(`swimmers.${index}.level` as const)}
                        >
                          <option value="">-- Sélectionner un niveau --</option>
                          {levels.map((level) => (
                            <option key={level.slug} value={level.slug}>
                              {level.name}
                            </option>
                          ))}
                          <option value="parent-enfant">Parent-enfant (moins de 3 ans)</option>
                        </select>
                        {errors?.swimmers?.[index]?.level && (
                          <p className="error-message">
                            {errors?.swimmers?.[index]?.level?.message ?? ''}
                          </p>
                        )}
                        {watchedSwimmers?.[index]?.level && (() => {
                          const info = getLevelInfo(watchedSwimmers[index].level);
                          if (!info) return null;
                          return (
                            <div className="level-detail">
                              <p dangerouslySetInnerHTML={{ __html: info.desc }} />
                              <ul className="level-detail__hints">
                                {info.hints.map((hint) => (
                                  <li key={hint}>{hint}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                )
            )}
          </div>
        </fieldset>
        <fieldset className="form__section rgpd" id="rgpd-section">
          <div className={`form__field col-100 ${errors.rgpd ? 'error' : ''}`}>
            <div className="checkbox-wrapper">
              <input type="checkbox" id="rgpd" {...register('rgpd')} aria-labelledby="rgpd-label" />
              <label htmlFor="rgpd" className="rgpd-label" id="rgpd-label">
                En soumettant ce formulaire, j'accepte que les informations saisies dans ce
                formulaire soient utilisées pour permettre de me recontacter. Lire les{' '}
                <a href="/mentions-legales">mentions légales</a>.
              </label>
            </div>
            {errors?.rgpd?.message && (
              <p className="error-message" role="alert">
                {errors.rgpd.message}
              </p>
            )}
          </div>
        </fieldset>
        <HoneyPot register={register} />
        <SubmitBtn />
      </form>
      {isModalOpen && (
        <SubmissionStatusModal isSuccess={isSubmissionSuccessful} onClose={closeModal} />
      )}
    </>
  );
};

export default SwimmingForm;
