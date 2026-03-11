import { useState, useCallback } from 'react';

export const useForm = (initialValues, validationSchema = null) => {
  const [values, setValues]       = useState(initialValues);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (touched[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }, [touched]);

  const handleBlur = useCallback((e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  }, []);

  const setValue = useCallback((name, value) => setValues((prev) => ({ ...prev, [name]: value })), []);

  const setError = useCallback((name, msg) => setErrors((prev) => ({ ...prev, [name]: msg })), []);

  const validate = useCallback(() => {
    if (!validationSchema) return true;
    const newErrors = {};
    for (const [field, rules] of Object.entries(validationSchema)) {
      for (const rule of rules) {
        const err = rule(values[field], values);
        if (err) { newErrors[field] = err; break; }
      }
    }
    setErrors(newErrors);
    setTouched(Object.keys(validationSchema).reduce((a, k) => ({ ...a, [k]: true }), {}));
    return Object.keys(newErrors).length === 0;
  }, [validationSchema, values]);

  const handleSubmit = useCallback((onSubmit) => async (e) => {
    e?.preventDefault();
    if (validationSchema && !validate()) return;
    setSubmitting(true);
    try { await onSubmit(values); }
    finally { setSubmitting(false); }
  }, [validate, values, validationSchema]);

  const reset = useCallback((newValues) => {
    setValues(newValues ?? initialValues);
    setErrors({});
    setTouched({});
    setSubmitting(false);
  }, [initialValues]);

  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return { values, errors, touched, submitting, isDirty, handleChange, handleBlur, setValue, setError, setErrors, validate, handleSubmit, reset };
};
