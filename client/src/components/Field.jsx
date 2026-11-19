export default function Field({ label, name, type = 'text', error, required, textarea, sfx = '', ...rest }) {
  const id = `f-${name}${sfx}`;
  const props = { id, name, 'aria-invalid': error ? 'true' : undefined, 'aria-describedby': error ? `${id}-e` : undefined, ...rest };
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>{label}{required && <span className="req" aria-hidden="true"> *</span>}</label>
      {textarea ? <textarea rows="4" {...props} /> : <input type={type} {...props} />}
      {error && <p className="field__err" id={`${id}-e`}>{error}</p>}
    </div>
  );
}
