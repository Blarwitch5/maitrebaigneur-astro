import site from "@assets/data/data.json";

const { swimmingLevels } = site;
const levels = swimmingLevels;

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import RgpdField from "./RgpdField.tsx";
import SubmitBtn from "./SubmitBtn.tsx";

const SwimmingFormSchema = z.object({
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
  address: z
    .string()
    .min(4, { message: "The first name must be 4 characters or more" })
    .max(10, { message: "The first name must be 10 characters or less" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "The first name must contain only letters, numbers and underscore (_)"
    ),
  zipCode: z
    .number()
    .min(4, { message: "The first name must be 4 characters or more" })
    .max(5, { message: "The first name must be 10 characters or less" }),
  city: z
    .string()
    .min(4, { message: "The first name must be 4 characters or more" })
    .max(10, { message: "The first name must be 10 characters or less" })
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "The first name must contain only letters, numbers and underscore (_)"
    ),
  tel: z
    .string()
    .min(10, { message: "The phone number must be 10 characters or more" })
    .max(15, { message: "The phone number must be 15 characters or less" })
    .regex(/^[0-9]+$/, "The phone number must contain only numbers (0-9)"),
  dates: z
    .string()
    .min(10, { message: "The message must be 10 characters or more" }),
});

type SwimmingFormInput = z.infer<typeof SwimmingFormSchema>;

const SwimmingForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SwimmingFormInput>({
    resolver: zodResolver(SwimmingFormSchema),
  });

  const onSubmit = (data: SwimmingFormInput) => {
    console.log(data);
  };

  const handleFormSubmit = (data: SwimmingFormInput) => {
    onSubmit(data);
  };

  return (
    <form method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
      <fieldset className="form__section" id="swimming-lessons">
        <legend>Contact pour leçons de natation à domicile</legend>
        <div className="form__field col-100">
          <label htmlFor="name">
            Nom d'un des parents <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("name")}
          />
          {errors?.name?.message && <p>{errors.name.message}</p>}
        </div>
        <div className="form__field col-100">
          <label htmlFor="nom-enfants-natation-domicile">
            Prénoms du ou des enfants <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("firstName")}
          />
          <small>
            Dans le cas de plusieurs enfants, séparer les prénoms par une
            virgule
          </small>
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
          <label htmlFor="address">
            Adresse de la piscine <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("address")}
          />
          {errors?.address?.message && <p>{errors.address.message}</p>}
        </div>
        <div className="form__field col-50">
          <label htmlFor="zipCode">
            Code postal <span className="required">*</span>
          </label>
          <input
            placeholder=""
            type="text"
            pattern="\d{5}"
            title="Code postal français à 5 chiffres"
            {...register("zipCode")}
          />
          {errors?.zipCode?.message && <p>{errors.zipCode.message}</p>}
        </div>
        <div className="form__field col-50">
          <label htmlFor="city">
            Ville <span className="required">*</span>
          </label>
          <input
            title="cfez"
            placeholder=""
            type="text"
            {...register("city")}
          />
          {errors?.city?.message && <p>{errors.city.message}</p>}
        </div>
        <div className="form__field col-100">
          <label htmlFor="dates">
            Quand vodriez-vous réserver un cours ?{" "}
            <span className="required">*</span>
          </label>
          <textarea id="dates" rows={3} {...register("dates")}></textarea>
          <small>Veuillez nous fournir plusieurs dates et heures</small>
          {errors?.dates?.message && <p>{errors.dates.message}</p>}
        </div>

        <p className="col-100">
          Nous ne garantissons pas la réservation de vos créneaux mais nous
          ferons de notre mieux pour vous répondre favorablement.
        </p>

        <div className="col-100">
          <h3>Aide à l'évaluation du niveau du baigneur</h3>
          <ul className="levels">
            {levels.map((level) => (
              <li key={level.name}>
                <span>{level.name}</span>
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
        </div>
      </fieldset>
      <RgpdField />
      <SubmitBtn />
    </form>
  );
};

export default SwimmingForm;
