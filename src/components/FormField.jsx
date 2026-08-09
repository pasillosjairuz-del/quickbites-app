export default function FormField({ id, label, type = 'text', value, onChange, placeholder, required = false }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
      />
    </div>
  )
}
