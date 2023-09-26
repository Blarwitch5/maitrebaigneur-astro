import React, { useState, useEffect } from "react";

import OptionsRadioBtn from "@components/forms/OptionsRadioBtn";
import SwimmingForm from "@components/forms/SwimmingForm";
import AquaversaryForm from "@components/forms/AquaversaryForm";
import SurveillanceForm from "@components/forms/SurveillanceForm";
import ContactForm from "@components/forms/ContactForm";
import BabySwimmerForm from "@components/forms/BabySwimmerForm";
import SwimminginstationForm from "@components/forms/SwimmingInStationForm";

// Import the options data from the JSON file
import optionsData from "../../assets/data/formOptions.json";

// Define the Option type
interface Option {
  option: string;
  value: string;
  slug: string;
  title: string;
  content: string;
  className: string;
  formComponent: string; // Change this to string
}

const Form = () => {
  const [selectedOption, setSelectedOption] = useState<string>("");

  const updateURL = (slug: string) => {
    const newUrl = `/contact?option=${slug}`;
    window.history.pushState({}, "", newUrl);
    setSelectedOption(slug);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const optionFromURL = urlParams.get("option");

    if (optionFromURL) {
      setSelectedOption(optionFromURL);
    }
  }, []);

  // Define the type for renderFormComponent
  const renderFormComponent = (componentName: string): JSX.Element | null => {
    switch (componentName) {
      case "SwimminginstationForm":
        return <SwimminginstationForm />;
      case "BabySwimmerForm":
        return <BabySwimmerForm />;
      case "SwimmingForm":
        return <SwimmingForm />;
      case "SurveillanceForm":
        return <SurveillanceForm />;
      case "AquaversaryForm":
        return <AquaversaryForm />;
      case "ContactForm":
        return <ContactForm />;
      default:
        return null;
    }
  };

  return (
    <>
      <fieldset className="form__group">
        <legend>En quoi pouvons-nous vous aider ?</legend>
        <div className="radio__group">
          {optionsData.map((option: Option) => (
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

      {optionsData
        .filter((option: Option) => selectedOption === option.slug)
        .map((option: Option) => (
          <div key={option.slug}>
            {renderFormComponent(option.formComponent)}
          </div>
        ))}
    </>
  );
};

export default Form;
