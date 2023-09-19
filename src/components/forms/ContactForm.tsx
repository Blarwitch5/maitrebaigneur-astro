import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import RgpdField from "./RgpdField.tsx";
import SubmitBtn from "./SubmitBtn.tsx";

const FormSchema = z.object({
  name: z
    .string()
    .min(4, { message: "The name must be 4 characters or more" })
    .max(10, { message: "The name must be 10 characters or less" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "The name must contain only letters, numbers and underscore (_)"
    ),
  firstName: z
    .string()
    .min(4, { message: "The first name must be 4 characters or more" })
    .max(10, { message: "The first name must be 10 characters or less" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "The first name must contain only letters, numbers and underscore (_)"
    ),
  email: z.string().email({
    message: "Invalid email. Please enter a valid email address",
  }),
  tel: z
    .string()
    .min(10, { message: "The phone number must be 10 characters or more" })
    .max(15, { message: "The phone number must be 15 characters or less" })
    .regex(/^[0-9]+$/, "The phone number must contain only numbers (0-9)"),
  message: z
    .string()
    .min(10, { message: "The message must be 10 characters or more" }),
});

type FormInput = z.infer<typeof FormSchema>;

const ContactForm = () => {
  const formcarryContactFormId: string = import.meta.env
    .VITE_FORMCARRY_CONTACTFORM_ID as string;

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
    },
  });
  const onSubmit = async (data: FormInput) => {
    try {
      // Validate using Zod
      FormSchema.parse(data);

      const response = await fetch(
        `https://formcarry.com/s/${formcarryContactFormId}`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

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

        <div className="form__field">
          <label htmlFor="name">
            Nom <span className="required">*</span>
          </label>
          <input id="name" {...register("name")} />
          {errors?.name?.message && <p>{errors.name.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="firstName">
            Prénom <span className="required">*</span>
          </label>
          <input id="firstName" {...register("firstName")} />
          {errors?.firstName?.message && <p>{errors.firstName.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="tel">
            Numéro de téléphone <span className="required">*</span>
          </label>
          <input id="tel" type="tel" {...register("tel")} />
          {errors?.tel?.message && <p>{errors.tel.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="email">
            Adresse mail <span className="required">*</span>
          </label>
          <input id="email" type="email" {...register("email")} />
          {errors?.email?.message && <p>{errors.email.message}</p>}
        </div>
        <div className="form__field col-100">
          <label htmlFor="message">
            Message <span className="required">*</span>
          </label>
          <textarea id="message" rows={3} {...register("message")}></textarea>
          {errors?.message?.message && <p>{errors.message.message}</p>}
        </div>
      </fieldset>
      <RgpdField />
      <SubmitBtn />
    </form>
  );
};
export default ContactForm;
