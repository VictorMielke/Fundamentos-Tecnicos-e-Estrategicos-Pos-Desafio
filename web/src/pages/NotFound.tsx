import { Link } from 'react-router-dom';
import notFoundIllustration from '../assets/figma/not-found.svg';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#E4E6EC] px-3 pb-10 pt-10 md:px-6 md:pt-16">
      <section className="mx-auto mt-[140px] w-full max-w-[980px] md:mt-[120px]">
        <div className="mx-auto flex min-h-[302px] w-full max-w-[366px] flex-col items-center rounded-[8px] bg-[#F9F9FB] px-6 py-8 text-center md:min-h-[329px] md:max-w-[580px] md:px-10 md:py-10">
          <img src={notFoundIllustration} alt="Pagina nao encontrada" className="mb-6 h-auto w-[194px] md:w-[256px]" />

          <h1 className="m-0 text-[24px] font-bold leading-tight text-[#1F2025]">Link nao encontrado</h1>
          <p className="mb-0 mt-3 max-w-[310px] text-center text-sm leading-relaxed text-[#4D505C] md:max-w-[420px]">
            O link que voce esta tentando acessar nao existe, foi removido ou e uma URL invalida. Saiba mais em{' '}
            <Link
              to="/"
              className="font-semibold underline underline-offset-2"
              style={{ color: '#2C46B1' }}
            >
              brev.ly
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
