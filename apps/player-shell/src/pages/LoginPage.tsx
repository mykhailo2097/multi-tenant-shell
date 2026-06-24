import { useState } from 'react';
import type { FormEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrandComponents } from '@mts/theme-kit';
import { useApi } from '../api/api.context';
import { useSession } from '../session/session.context';
import { validateEmail, validatePassword } from '../lib/validation';
import { DEMO_FAILING_EMAIL } from '../api/mock.constants';

interface FieldErrors {
  email?: string;
  password?: string;
}

export function LoginPage() {
  const { Card, Button } = useBrandComponents();
  const { identity } = useApi();
  const { user, signIn } = useSession();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const nextErrors: FieldErrors = {
      email: validateEmail(email) ?? undefined,
      password: validatePassword(password) ?? undefined,
    };
    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});

    setSubmitting(true);
    try {
      const loggedIn = await identity.login(email, password);
      signIn(loggedIn);
      navigate('/account/billing');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (user) {
    return (
      <Card title="You're signed in">
        <p className="text-brand-text-muted mt-0 mb-4">
          Signed in as <strong>{user.email}</strong>.
        </p>
        <Button onClick={() => navigate('/account/billing')}>Go to billing</Button>
      </Card>
    );
  }

  return (
    <Card title="Sign in">
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p className="text-brand-danger text-[13px] mt-1.5" id="email-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <p className="text-brand-danger text-[13px] mt-1.5" id="password-error">
              {errors.password}
            </p>
          )}
        </div>

        {submitError && (
          <p className="text-brand-danger text-[13px] mb-4" role="alert">
            {submitError}
          </p>
        )}

        <Button type="submit" disabled={submitting} fullWidth>
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>
        <p className="text-brand-text-muted text-xs mt-2 mb-0">
          Tip: any valid email works. Use <code>{DEMO_FAILING_EMAIL}</code> to see the error state.
        </p>
      </form>
    </Card>
  );
}
