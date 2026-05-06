import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import logoIcon from '../assets/figma/logo-icon.svg';
import { useLink } from '../hooks/useLinks';

export default function Redirect() {
  const { shortUrl = '' } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useLink(shortUrl);

  useEffect(() => {
    if (!data?.originalUrl) return;

    const backendBase = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
    if (!backendBase) {
      window.location.href = data.originalUrl;
      return;
    }

    window.location.href = `${backendBase}/${shortUrl}`;
  }, [data, shortUrl]);

  useEffect(() => {
    if (isError && !isLoading) navigate('/not-found', { replace: true });
  }, [isError, isLoading, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[0_8px_24px_rgba(16,16,30,0.08)]">
        <img src={logoIcon} alt="Logo" className="mx-auto mb-4 h-14 w-14" />
        <h1 className="m-0 text-2xl font-bold">Redirecionando...</h1>
        <p className="mt-3 text-sm text-[var(--text-muted)]">O link sera aberto automaticamente em alguns instantes.</p>
        {data?.originalUrl ? (
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Nao foi redirecionado?{' '}
            <a className="font-semibold underline" style={{ color: '#2C46B1' }} href={data.originalUrl}>
              Acesse aqui
            </a>
          </p>
        ) : (
          <Link className="mt-4 block text-sm font-semibold underline" style={{ color: '#2C46B1' }} to="/">
            Voltar para a home
          </Link>
        )}
      </div>
    </main>
  );
}
