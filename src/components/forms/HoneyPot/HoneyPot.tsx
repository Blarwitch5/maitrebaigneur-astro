import type { UseFormRegister } from 'react-hook-form';

const HoneyPot = ({ register }: { register: UseFormRegister<any> }) => {
  return (
    <div style={{ display: 'none' }}>
      <label htmlFor="honeypot">Leave this field empty:</label>
      <input
        type="text"
        id="honeypot"
        autoComplete="off"
        tabIndex={-1}
        {...register('honeypot')}
      />
    </div>
  );
};

export default HoneyPot;
