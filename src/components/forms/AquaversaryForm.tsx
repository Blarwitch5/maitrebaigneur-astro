import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import RgpdField from "./RgpdField.tsx";
import SubmitBtn from "./SubmitBtn.tsx";

const AquaversaryFormSchema = z.object({
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

type AquaversaryFormInput = z.infer<typeof AquaversaryFormSchema>;

const AquaversaryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AquaversaryFormInput>({
    resolver: zodResolver(AquaversaryFormSchema),
    defaultValues: {
      name: "",
      firstName: "",
      email: "",
      tel: "",
      message: "",
    },
  });

  const onSubmit = (data: AquaversaryFormInput) => {
    console.log(data);
  };

  const handleFormSubmit = (data: AquaversaryFormInput) => {
    onSubmit(data);
  };

  return (
    <form method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset className="form__section" id="aquaversary">
        <legend>Contact pour un Aquaversaire</legend>
        <div className="form__field">
          <label htmlFor="name">
            Nom <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("name")}
          />
          {errors?.name?.message && <p>{errors.name.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="firstName">
            Prénom <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("firstName")}
          />
          {errors?.firstName?.message && <p>{errors.firstName.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="tel">
            Numéro de téléphone <span className="required">*</span>
          </label>
          <input title="cfez" placeholder="" type="tel" {...register("tel")} />
          {errors?.tel?.message && <p>{errors.tel.message}</p>}
        </div>
        <div className="form__field">
          <label htmlFor="email">
            Adresse mail <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="email"
            {...register("email")}
          />
          {errors?.email?.message && <p>{errors.email.message}</p>}
        </div>
        <div className="form__field col-100">
          <label htmlFor="info-aquaversaire">
            Où ? Quand ? Et combien de baigneurs{" "}
            <span className="required">*</span>
          </label>
          <textarea id="message" rows={3} {...register("message")}></textarea>
          <small>
            Exemple: Je souhaite organiser un aquaversaire à Aix le 01/01/23
            pour 10 enfants...
          </small>
          {errors?.message?.message && <p>{errors.message.message}</p>}
        </div>
      </fieldset>
      <RgpdField />
      <SubmitBtn />
    </form>
  );
};

export default AquaversaryForm;
