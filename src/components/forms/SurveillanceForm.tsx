import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

import SubmitBtn from "./SubmitBtn.tsx";
import HoneyPot from "@components/forms/HoneyPot/HoneyPot.tsx";
import SubmissionStatusModal from "@components/forms/SubmissionStatusModal/SubmissionStatusModal.tsx";

const SurveillanceFormSchema = z.object({
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
  info: z.string().min(10, {
    message: "Les informations doivent contenir un minimum de 10 caractères.",
  }),

  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
  honeypot: z.string().refine((value) => value === "", {
    message: "Honey pot doit être vide.",
  }),
});

type SurveillanceFormInput = z.infer<typeof SurveillanceFormSchema>;

const SurveillanceForm = () => {
  const formcarryFormEndpoint: string = import.meta.env
    .PUBLIC_FORMCARRY_EVENTFORM_ENDPOINT as string;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmissionSuccessful, setIsSubmissionSuccessful] = useState(false);

  const onSubmit = async (data: SurveillanceFormInput) => {
    try {
      // Validate using Zod
      SurveillanceFormSchema.parse(data);

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
        reset();
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SurveillanceFormInput>({
    resolver: zodResolver(SurveillanceFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      tel: "",
      info: "",
      honeypot: "",
      rgpd: false,
    },
  });

  const handleFormSubmit = (data: SurveillanceFormInput) => {
    if (data.honeypot !== "") {
      console.log("Ceci est une soumission de bot ! Blocage en cours...");
      // You can choose to display an error message here if you prefer.
      // For now, just block the submission.
      return;
    }
    onSubmit(data);
  };

  return (
    <>
      {" "}
      <form
        method="POST"
        onSubmit={handleSubmit(handleFormSubmit)}
        role="form"
        aria-labelledby="events"
        autoComplete="on" // Enable browser autocomplete
      >
        <fieldset className="form__section" id="events">
          <legend>Contact pour de la surveillance</legend>
          <div className={`form__field ${errors.name ? "error" : ""}`}>
            <label htmlFor="name">
              Nom <span className="required">*</span>
            </label>
            <input
              id="name"
              type="text" // Use type="text" for name input
              {...register("name")}
              autoComplete="family-name" // Add autocomplete for first name
            />
            {errors?.name?.message && (
              <p className="error-message">{errors.name.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.firstName ? "error" : ""}`}>
            <label htmlFor="firstName">
              Prénom <span className="required">*</span>
            </label>
            <input
              id="firstName"
              type="text" // Use type="text" for first name input
              {...register("firstName")}
              autoComplete="given-name" // Add autocomplete for last name
            />
            {errors?.firstName?.message && (
              <p className="error-message">{errors.firstName.message}</p>
            )}
          </div>
          <div className={`form__field ${errors.tel ? "error" : ""}`}>
            <label htmlFor="tel">
              Numéro de téléphone <span className="required">*</span>
            </label>
            <input
              id="tel"
              type="tel"
              {...register("tel")}
              autoComplete="tel" // Add autocomplete for telephone number
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
              id="email"
              type="email"
              {...register("email")}
              autoComplete="email" // Add autocomplete for email
            />
            {errors?.email?.message && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>
          <div className={`form__field col-100 ${errors.info ? "error" : ""}`}>
            <label htmlFor="info">
              Où ? Quand ? Et combien de personnes ? Quel type d'événement ?
            </label>
            <textarea
              id="info"
              rows={3}
              {...register("info")}
              autoComplete="off" // Disable autocomplete for custom text area
            ></textarea>
            <small>
              Exemple: Je souhaite organiser un aquaversaire à Aix le 01/01/23
              pour 10 enfants...
            </small>
            {errors?.info?.message && (
              <p className="error-message">{errors.info.message}</p>
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
                aria-describedby="rgpd-description" // Add ARIA reference
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
export default SurveillanceForm;
