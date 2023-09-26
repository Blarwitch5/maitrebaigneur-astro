import { useState, useEffect } from "react";
import OptionsRadioBtn from "@components/forms/OptionsRadioBtn";

import SwimmingForm from "@components/forms/SwimmingForm";
import AquaversaryForm from "@components/forms/AquaversaryForm";
import SurveillanceForm from "@components/forms/SurveillanceForm";
import ContactForm from "@components/forms/ContactForm";
import BabySwimmerForm from "@components/forms/BabySwimmerForm";
import SwimminginstationForm from "@components/forms/SwimmingInStationForm";

interface Option {
  option: string;
  value: string;
  slug: string;
  title: string;
  content: string;
  className: string;
  formComponent: React.FC;
}

const options: Option[] = [
  {
    option: "option1",
    value: "leçons de natation en station",
    slug: "lecons-de-natation-en-station",
    title: "Leçons de natation en bassin d'apprentissage",
    content: "Custom content for option 1",
    className: "card card-swimming",
    formComponent: SwimminginstationForm,
  },
  {
    option: "option2",
    value: "Cours de bébé nageur",
    slug: "cours-de-bebe-nageur",
    title: "Cours de bébé nageur",
    content: "Custom content for option 2",
    className: "card card-baby",
    formComponent: BabySwimmerForm,
  },
  {
    option: "option3",
    value: "leçons de natation à domicile",
    slug: "lecons-de-natation-a-domicile",
    title: "Leçons de natation à domicile",
    content: "Custom content for option 3",
    className: "card card-swimming",
    formComponent: SwimmingForm,
  },
  {
    option: "option4",
    value: "Sécurité d'un événement",
    slug: "securiser-un-evenement",
    title: "Sécurité d'un événement",
    content: "Custom content for option 4",
    className: "card card-events",
    formComponent: SurveillanceForm,
  },
  {
    option: "option5",
    value: "Organisation d'un aquaversaire",
    slug: "organiser-un-aquaversaire",
    title: "Organisation d'un aquaversaire",
    content: "Custom content for option 5",
    className: "card card-aquaversary",
    formComponent: AquaversaryForm,
  },
  {
    option: "option6",
    value: "Autres questions ou suggestions",
    slug: "autres-questions-ou-suggestions",
    title: "Autres questions ou suggestions",
    content: "Custom content for option 6",
    className: "card card-questions",
    formComponent: ContactForm,
  },
];
const Form = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const updateURL = (slug: string) => {
    const newUrl = `/contact?option=${slug}`;
    window.history.pushState({}, "", newUrl);

    // After updating the URL, set the selected option
    setSelectedOption(slug);
  };

  useEffect(() => {
    // Parse the URL to get the 'option' query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const optionFromURL = urlParams.get("option");

    if (optionFromURL) {
      // Set the selected option if the 'option' query parameter is present
      setSelectedOption(optionFromURL);
    }
  }, []);

  return (
    <>
      <fieldset className="form__group">
        <legend>En quoi pouvons-nous vous aider ?</legend>
        <div className="radio__group">
          {options.map((option) => (
            <div className="form__field" key={option.option}>
              <OptionsRadioBtn
                option={option}
                isSelected={selectedOption === option.slug}
                onSelect={() => {
                  updateURL(option.slug);
                }}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {options
        .filter((option) => selectedOption === option.slug)
        .map((option) => (
          <div key={option.slug}>
            <option.formComponent />
          </div>
        ))}
    </>
  );
};

export default Form;
