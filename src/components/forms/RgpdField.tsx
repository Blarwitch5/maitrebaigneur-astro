const RgpdFIeld = () => {
  return (
    <fieldset className="form__section rgpd" id="rgpd-section">
      <div className="form__field col-100">
        <input type="checkbox" name="rgpd" id="rgpd" required />
        <label htmlFor="rgpd" className="rgpd-label">
          En soumettant ce formulaire, j'accepte que les informations saisies
          dans ce formulaire soient utilisées pour permettre de me recontacter.
        </label>
      </div>
    </fieldset>
  );
};
export default RgpdFIeld;
