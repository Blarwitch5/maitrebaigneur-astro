import site from "@assets/data/data.json";

const { swimmingLevels } = site;
const levels = swimmingLevels;

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SubmitBtn from "./SubmitBtn.tsx";
import LevelsHelp from "../widgets/LevelsHelp/LevelsHelp.tsx";
import Notice from "@components/ui/notice/Notice.tsx";

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
  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
});

type SwimmingFormInput = z.infer<typeof SwimmingFormSchema>;

const SwimmingForm = () => {
  const {
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
      rgpd: false,
    },
  });

  const onSubmit = (data: SwimmingFormInput) => {
    console.log(data);
  };

  const handleFormSubmit = (data: SwimmingFormInput) => {
    onSubmit(data);
  };
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => {
    setIsPopupOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    document.body.style.overflow = "auto";
  };

  return (
    <form method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset className="form__section" id="swimming-lessons">
        <legend>Contact pour leçons de natation à domicile</legend>
        <div className={`form__field col-100 ${errors.name ? "error" : ""}`}>
          <label htmlFor="name">
            Nom d'un parent <span className="required">*</span>
          </label>
          <input
            type="text"
            title="Nom d'un parent"
            id="name"
            {...register("name")}
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
          />
          {errors?.email?.message && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>
        <div className={`form__field col-100 ${errors.address ? "error" : ""}`}>
          <label htmlFor="address">
            Adresse de la piscine <span className="required">*</span>
          </label>
          <input
            id="address"
            title="Adresse de la piscine"
            type="text"
            {...register("address")}
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
            placeholder="13100"
            type="text"
            pattern="\d{5}"
            title="Code postal français à 5 chiffres"
            {...register("zipCode")}
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
            title="cfez"
            placeholder=""
            type="text"
            {...register("city")}
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
          <textarea id="dates" rows={3} {...register("dates")}></textarea>
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
            Aide à l'évaluation du niveau du baigneur
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
      </fieldset>
      <fieldset className="form__section rgpd" id="rgpd-section">
        <div className={`form__field col-100 ${errors.rgpd ? "error" : ""}`}>
          <div className="checkbox-wrapper">
            <input type="checkbox" id="rgpd" {...register("rgpd")} />
            <label
              htmlFor="rgpd"
              className="rgpd-label"
              aria-describedby="label"
            >
              En soumettant ce formulaire, j'accepte que les informations
              saisies dans ce formulaire soient utilisées pour permettre de me
              recontacter. Lire les{" "}
              <a href="/mentions-legales">mentions légales</a>.
            </label>
          </div>
          {errors?.rgpd?.message && (
            <p className="error-message">{errors.rgpd.message}</p>
          )}
        </div>
      </fieldset>
      <SubmitBtn />
    </form>
  );
};

export default SwimmingForm;
