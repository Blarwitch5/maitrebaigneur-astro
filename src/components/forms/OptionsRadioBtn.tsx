import "./OptionsRadioBtn.scss";

interface Option {
  option: string;
  value: string;
  title: string;
  slug: string;
  className?: string; // Add className prop
}

interface OptionsRadioBtnProps {
  option: Option;
  isSelected: boolean; // Add isSelected prop
  onSelect: () => void; // Add onSelect prop
}

const OptionsRadioBtn: React.FC<OptionsRadioBtnProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  return (
    <label
      htmlFor={option.option}
      className={`${option.className} ${isSelected ? "selected" : ""}`}
    >
      <input
        onClick={() => {
          console.log("Radio button clicked");
          onSelect();
        }}
        type="radio"
        autoComplete="off"
        name="option"
        data-option={option.slug}
        value={option.value}
        id={option.option}
        className="radio"
        checked={isSelected} // Set checked based on isSelected prop
        onChange={onSelect} // Call onSelect when the input is changed
      />
      <span className="sr-only">{option.title}</span>
      <span className="card__title" aria-hidden="true">
        {option.title}
      </span>
    </label>
  );
};

export default OptionsRadioBtn;
