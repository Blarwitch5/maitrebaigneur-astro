interface HoneyPotProps {
  className?: string;
}

const HoneyPot: React.FC<HoneyPotProps> = () => {
  return (
    <div style={{ display: "none" }}>
      <label htmlFor="honeypot">Leave this field empty:</label>
      <input
        type="text"
        id="honeypot"
        name="honeypot"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
};

export default HoneyPot;
