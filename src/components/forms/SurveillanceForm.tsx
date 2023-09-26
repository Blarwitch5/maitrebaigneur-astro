import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import SubmitBtn from "./SubmitBtn.tsx";

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

  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
  info: z.string().min(10, {
    message: "Les informations doivent contenir un minimum de 10 caractères.",
  }),
});

type SurveillanceFormInput = z.infer<typeof SurveillanceFormSchema>;

const SurveillanceForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SurveillanceFormInput>({
    resolver: zodResolver(SurveillanceFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      tel: "",
      info: "",
      rgpd: false,
    },
  });

  const onSubmit = (data: SurveillanceFormInput) => {
    console.log(data);
  };

  const handleFormSubmit = (data: SurveillanceFormInput) => {
    onSubmit(data);
  };

  return (
    <form method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset className="form__section" id="events">
        <legend>Contact pour de la surveillance</legend>
        <div className={`form__field ${errors.name ? "error" : ""}`}>
          <label htmlFor="name">
            Nom <span className="required">*</span>
          </label>
          <input id="name" {...register("name")} />
          {errors?.name?.message && (
            <p className="error-message">{errors.name.message}</p>
          )}
        </div>
        <div className={`form__field ${errors.firstName ? "error" : ""}`}>
          <label htmlFor="firstName">
            Prénom <span className="required">*</span>
          </label>
          <input id="firstName" {...register("firstName")} />
          {errors?.firstName?.message && (
            <p className="error-message">{errors.firstName.message}</p>
          )}
        </div>
        <div className={`form__field ${errors.tel ? "error" : ""}`}>
          <label htmlFor="tel">
            Numéro de téléphone <span className="required">*</span>
          </label>
          <input id="tel" type="tel" {...register("tel")} />
          <small>Exemple: +33612121212, 0033612121212 ou 0612121212</small>

          {errors?.tel?.message && (
            <p className="error-message">{errors.tel.message}</p>
          )}
        </div>
        <div className={`form__field ${errors.email ? "error" : ""}`}>
          <label htmlFor="email">
            Adresse mail <span className="required">*</span>
          </label>
          <input id="email" type="email" {...register("email")} />
          {errors?.email?.message && (
            <p className="error-message">{errors.email.message}</p>
          )}
        </div>
        <div className={`form__field col-100 ${errors.info ? "error" : ""}`}>
          <label htmlFor="info">
            Où ? Quand ? Et combien de personnes ? Quel type d'événement ?
          </label>
          <textarea id="info" rows={3} {...register("info")}></textarea>
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
              aria-describedby="label"
            >
              En soumettant ce formulaire, j'accepte que les informations
              saisies dans ce formulaire soient utilisées pour permettre de me
              recontacter. Lire les
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
export default SurveillanceForm;
