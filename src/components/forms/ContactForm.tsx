import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import SubmitBtn from "./SubmitBtn.tsx";

const FormSchema = z.object({
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
  message: z.string().min(5, {
    message: "Le message doit contenir un minimum de 5 caractères.",
  }),
  rgpd: z.boolean().refine((value) => value === true, {
    message: "Vous devez accepter les conditions d'utilisation.",
  }),
});

type FormInput = z.infer<typeof FormSchema>;

const ContactForm = () => {
  const formcarryContactFormEndpoint: string = import.meta.env
    .PUBLIC_FORMCARRY_CONTACTFORM_ENDPOINT as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInput>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      tel: "",
      message: "",
      rgpd: false,
    },
  });
  const onSubmit = async (data: FormInput) => {
    try {
      // Validate using Zod
      FormSchema.parse(data);

      const response = await fetch(formcarryContactFormEndpoint, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Form submission failed.");
      }
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  const handleFormSubmit = (data: FormInput) => {
    onSubmit(data);
  };

  return (
    <form method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset id="questions" className="form__section">
        <legend>Autres questions et suggestions</legend>

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
        <div className={`form__field col-100 ${errors.message ? "error" : ""}`}>
          <label htmlFor="message">
            Message <span className="required">*</span>
          </label>
          <textarea id="message" rows={3} {...register("message")}></textarea>
          {errors?.message?.message && (
            <p className="error-message">{errors.message.message}</p>
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
export default ContactForm;
