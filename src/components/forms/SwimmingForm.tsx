import site from "@assets/data/data.json";

const { swimmingLevels } = site;
const levels = swimmingLevels;

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import SubmitBtn from "./SubmitBtn.tsx";
import LevelsHelp from "../widgets/LevelsHelp/LevelsHelp.tsx";
import Notice from "@components/ui/notice/Notice.tsx";
import HoneyPot from "@components/forms/HoneyPot/HoneyPot.tsx";
import SubmissionStatusModal from "@components/forms/SubmissionStatusModal/SubmissionStatusModal.tsx";

const SwimmingFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Le nom doit contenir minimum 2 lettres." })
    .max(30, {
      message: "Le nom ne doit pas excéder 30 lettres.",
    })
    .regex(
      /^[a-zA-Z-]+$/,
      "Le nom ne doit contenir que des lettres et/ou des tirets (-)"
    ),
  firstName: z
    .string()
    .min(2, { message: "Le prénom doit contenir minimum 2 lettres." })
    .max(30, {
      message: "Le prénom ne doit pas excéder 30 lettres.",
    })
    .regex(
      /^[a-zA-Z-]+$/,
      "Le prénom ne doit contenir que des lettres et/ou des tirets (-)"
    ),
  email: z.string().email({
    message: "Email invalide. Veuillez entrer une adresse mail valide",
  }),
  tel: z
    .string()
    .min(7, {
      message: "Le numéro de téléphone doit contenir 10 chiffres ou plus",
    })
    .max(15, {
      message: "Le numéro de téléphone ne doit pas excéder 15 caractères.",
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
      /^[a-zA-Z0-9-, ]+$/,
      "L'adresse ne peut contenir que des lettres, chiffres et des tirets (-)"
    ),
  zipCode: z
    .string()
    .min(4, { message: "Le code postal doit avoir un minimum de 4 chiffres." })
    .max(5, { message: "Le code postal ne doit pas excéder 5 chiffres." })
    .regex(
      /^[0-9]+$/,
      "Le code postal doit être composé de chiffres uniquement;"
    ),
  city: z
    .string()
    .min(2, {
      message: "La nom de la ville doit contenir un minimum de 2 caractères.",
    })
    .max(35, {
      message: "Le nom de la ville ne doit pas excéder 35 caractères",
    })
    .regex(
      /^[a-zA-Z- ]+$/,
      "Le nom de la ville ne peut contenir que des lettres, des tirets (-) et des espaces"
    ),

  dates: z.string().min(10, {
    message:
      "Les informations sur les disponibilités doivent contenir un minim de 10 caractères.",
  }),
  numSwimmers: z
    .number()
    .min(1, { message: "Veuillez selectionner un nombre de baigneur" })
    .max(3),
  swimmers: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: "Le nom doit contenir minimum 2 lettres." })
          .max(50, {
            message: "Le nom ne doit pas excéder 50 lettres.",
          })
          .regex(
            /^[a-zA-Z- ]+$/,
            "Le nom ne doit contenir que des lettres, des tirets (-) et/ou des espaces"
          ),
        dob: z
          .string()
          .min(10, {
            message:
              "La date de naissance doit être au format date (ex. 'jj/mm/aaaa')",
          })
          .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "La date de naissance doit être au format date (ex. 'jj/mm/aaaa')"
          ),
        level: z
          .enum([
            "",
            "baigneur-en-douceur",
            "mini-baigneur",
            "petit-baigneur",
            "moyen-baigneur",
            "grand-baigneur",
            "adulte",
            "parent-enfant",
          ])
          .refine((value) => value !== "", {
            message: "Veuillez sélectionner un niveau.", // Custom error message for empty select field
          }),
      })
    )
    .max(3), // Ensure a maximum of 3 swimmers
  honeypot: z.string().refine((value) => value === "", {
    message: "Honey pot doit être vide.",
  }),
  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
});

type SwimmingFormInput = z.infer<typeof SwimmingFormSchema>;

const SwimmingForm = () => {
  const formcarryFormEndpoint: string = import.meta.env
    .PUBLIC_FORMCARRY_SWIMMINGFORM_ENDPOINT as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [numSwimmers, setNumSwimmers] = useState(1); // Default to 1 swimmer

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SwimmingFormInput>({
    resolver: zodResolver(SwimmingFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      address: "",
      zipCode: "",
      city: "",
      tel: "",
      dates: "",
      numSwimmers: 1,
      swimmers: [
        { name: "", level: "" },
        { name: "", level: "" },
        { name: "", level: "" },
      ],
      honeypot: "",
      rgpd: false,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "swimmers", // Field name for the array
  });

  const onSubmit = async (data: SwimmingFormInput) => {
    try {
      // Validate using Zod
      SwimmingFormSchema.parse(data);

      const response = await fetch(formcarryFormEndpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setIsSubmissionSuccessful(true);
      } else {
        setIsSubmissionSuccessful(false);
      }
      setIsModalOpen(true);
    } catch (error) {
      console.error("Validation error:", error);
      setIsSubmissionSuccessful(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = (data: SwimmingFormInput) => {
    if (data.honeypot !== "") {
      console.log("Ceci est une soumission de bot ! Blocage en cours...");
      return;
    }
    onSubmit(data);
  };

  // Function to handle the select change
  const handleNumSwimmersChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    setNumSwimmers(selectedValue);
  };

  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
        autoComplete="on"
        role="form"
        aria-labelledby="swimming-lessons"
      >
        {" "}
        <fieldset className="form__section" id="swimming-lessons">
          <legend id="swimming-lessons-legend">
            Contact pour leçons de natation à domicile
          </legend>
          <div className={`form__field col-100 ${errors.name ? "error" : ""}`}>
            <label htmlFor="name">
              Nom d'un parent <span className="required">*</span>
            </label>
            <input
              type="text"
              title="Nom d'un parent"
              id="name"
              {...register("name")}
              autoComplete="family-name"
            />
            {errors?.name?.message && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>
          <div
            className={`form__field col-100 ${errors.firstName ? "error" : ""}`}
          >
            <label htmlFor="firstName">
              Prénom de ou des enfants <span className="required">*</span>
            </label>
            <input
              title="Prénom de ou des enfants"
              type="text"
              id="firstName"
              {...register("firstName")}
              autoComplete="given-name"
            />
            <small>
              Dans le cas de plusieurs enfants, séparer les prénoms par une
              virgule
            </small>
            {errors?.firstName?.message && (
              <p className="error-message">{errors.firstName.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.tel ? "error" : ""}`}>
            <label htmlFor="tel">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <input
              title="Numéro de téléphone"
              id="tel"
              type="tel"
              {...register("tel")}
              autoComplete="tel"
            />
            <small>Exemple: +33612121212, 0033612121212 ou 0612121212</small>

            {errors?.tel?.message && (
              <p className="error-message">{errors.tel.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">
              Adresse mail <span className="required">*</span>
            </label>
            <input
              title="Adresse mail"
              id="email"
              type="email"
              {...register("email")}
              autoComplete="email"
            />
            {errors?.email?.message && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>
          <div
            className={`form__field col-100 ${errors.address ? "error" : ""}`}
          >
            <label htmlFor="address">
              Adresse de la piscine <span className="required">*</span>
            </label>
            <input
              id="address"
              title="Adresse de la piscine"
              type="text"
              {...register("address")}
              autoComplete="street-address"
            />
            {errors?.address?.message && (
              <p className="error-message">{errors.address.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.zipCode ? "error" : ""}`}>
            <label htmlFor="zipCode">
              Code postal <span className="required">*</span>
            </label>
            <input
              id="zipCode"
              placeholder="13100"
              type="text"
              pattern="\d{5}"
              title="Code postal français à 5 chiffres"
              {...register("zipCode")}
              autoComplete="postal-code"
            />
            {errors?.zipCode?.message && (
              <p className="error-message">{errors.zipCode.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.city ? "error" : ""}`}>
            <label htmlFor="city">
              Ville <span className="required">*</span>
            </label>
            <input
              id="city"
              title="city"
              placeholder=""
              type="text"
              {...register("city")}
              autoComplete="address-level2"
            />
            {errors?.city?.message && (
              <p className="error-message">{errors.city.message}</p>
            )}
          </div>
          <div className={`form__field col-100 ${errors.dates ? "error" : ""}`}>
            <label htmlFor="dates">
              Quand voudriez-vous réserver un cours ?
              <span className="required">*</span>
            </label>
            <textarea
              id="dates"
              rows={5}
              {...register("dates")}
              autoComplete="off"
            ></textarea>
            <small>Veuillez nous fournir plusieurs dates et heures</small>
            {errors?.dates?.message && (
              <p className="error-message">{errors.dates.message}</p>
            )}
          </div>
          <Notice
            className="col-100"
            type="info"
            message="Nous ne garantissons pas la réservation de vos créneaux mais nous
          ferons de notre mieux pour vous répondre favorablement."
          />
          <div className="col-100">
            <button className="btn btn__regular btn-help" onClick={openPopup}>
              Aide à l'évaluation
              <br /> du niveau du baigneur
            </button>

            {isPopupOpen && (
              <LevelsHelp isOpen={isPopupOpen} onClose={closePopup}>
                <ul className="levels">
                  {levels.map((level) => (
                    <li key={level.name}>
                      <span>{level.name}</span>
                      <picture>
                        <source type="image/webp" srcSet={level.image.webp} />
                        <img
                          src={level.image.jpg}
                          alt={level.image.alt}
                          width="400"
                          height="300"
                        />
                      </picture>

                      <p dangerouslySetInnerHTML={{ __html: level.desc }} />
                      <ul className="hints">
                        {level.hints.map((hint, index) => (
                          <li className="hint" key={index}>
                            {hint}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </LevelsHelp>
            )}
          </div>
          {/* Select field for the number of swimmers */}
          <div
            className={`form__field col-100 ${
              errors.numSwimmers ? "error" : ""
            }`}
          >
            <label htmlFor="numSwimmers">Nombre de nageurs</label>
            <select
              id="numSwimmers"
              {...register("numSwimmers")}
              onChange={handleNumSwimmersChange}
              value={numSwimmers}
            >
              <option value="1">1 nageur</option>
              <option value="2">2 nageurs</option>
              <option value="3">3 nageurs</option>
            </select>
          </div>
          <div className="col-100 ">
            {Array.from({ length: numSwimmers }).map((_, index) => (
              <div className="fieldgroup" key={`swimmer-${index}`}>
                <div>
                  <p className="fieldgroup__title">Baigneur {index + 1}</p>
                  <div
                    className={`form__field ${
                      errors?.swimmers?.[index]?.name ? "error" : ""
                    }`}
                  >
                    <label htmlFor={`swimmers.${index}.name`}>
                      Nom du nageur {index + 1}
                    </label>
                    <input
                      type="text"
                      id={`swimmers.${index}.name`}
                      {...register(`swimmers.${index}.name`)}
                      autoComplete="name"
                    />
                    {errors?.swimmers?.[index]?.name && (
                      <p className="error-message">
                        {errors?.swimmers?.[index]?.name?.message ?? ""}
                      </p>
                    )}
                  </div>
                  <div
                    className={`form__field ${
                      errors?.swimmers?.[index]?.dob ? "error" : ""
                    }`}
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
                      <p className="error-message">
                        {errors.swimmers?.[index]?.dob?.message}
                      </p>
                    )}
                  </div>
                  <div
                    className={`form__field ${
                      errors?.swimmers?.[index]?.level ? "error" : ""
                    }`}
                  >
                    <label htmlFor={`swimmers.${index}.level`}>
                      Niveau du nageur {index + 1}
                    </label>
                    <select
                      id={`swimmers.${index}.level`}
                      {...register(`swimmers.${index}.level` as const)}
                      autoComplete="on"
                    >
                      <option value="">-- Sélectionner un niveau --</option>
                      <option value="baigneur-en-douceur">
                        Baigneur en douceur
                      </option>
                      <option value="mini-baigneur">Mini baigneur</option>
                      <option value="petit-baigneur">Petit baigneur</option>
                      <option value="moyen-baigneur">Moyen baigneur</option>
                      <option value="grand-baigneur">Grand baigneur</option>
                      <option value="adulte">Adulte</option>
                      <option value="parent-enfant">
                        Parent enfant (moins de 3 ans)
                      </option>
                    </select>
                    {errors?.swimmers?.[index]?.level && (
                      <p className="error-message">
                        {errors?.swimmers?.[index]?.level?.message ?? ""}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </fieldset>
        <fieldset className="form__section rgpd" id="rgpd-section">
          <div className={`form__field col-100 ${errors.rgpd ? "error" : ""}`}>
            <div className="checkbox-wrapper">
              <input
                type="checkbox"
                id="rgpd"
                {...register("rgpd")}
                aria-labelledby="rgpd-label"
              />
              <label htmlFor="rgpd" className="rgpd-label" id="rgpd-label">
                En soumettant ce formulaire, j'accepte que les informations
                saisies dans ce formulaire soient utilisées pour permettre de me
                recontacter. Lire les{" "}
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
        <HoneyPot />
        <SubmitBtn />
      </form>
      {isModalOpen && (
        <SubmissionStatusModal
          isSuccess={isSubmissionSuccessful}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default SwimmingForm;
