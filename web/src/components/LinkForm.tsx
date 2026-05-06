import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { createLinkSchema } from '../schemas/linkSchema';
import type { CreateLinkFormData } from '../schemas/linkSchema';
import { useCreateLink } from '../hooks/useLinks';
import { Button } from './Button';
import { Input } from './Input';

export function LinkForm() {
  const { mutateAsync, isPending } = useCreateLink();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateLinkFormData>({
    resolver: zodResolver(createLinkSchema),
    defaultValues: { originalUrl: '', shortUrl: '' },
  });

  const onSubmit = async (data: CreateLinkFormData) => {
    try {
      await mutateAsync({ originalUrl: data.originalUrl, shortUrl: data.shortUrl || undefined });
      toast.success('Link criado com sucesso');
      reset();
    } catch (error: any) {
      toast.error(error.friendlyMessage || 'Falha ao criar link');
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Link original</label>
        <Input
          className="h-12 rounded-md"
          placeholder="www.exemplo.com.br"
          disabled={isPending}
          error={errors.originalUrl?.message}
          {...register('originalUrl')}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--text-muted)]">Link encurtado</label>
        <Input
          className="h-12 rounded-md"
          prefix="brev.ly/"
          placeholder="meu-link"
          disabled={isPending}
          error={errors.shortUrl?.message}
          {...register('shortUrl')}
        />
      </div>

      <Button type="submit" className="mt-1 h-11 w-full rounded-md text-sm" loading={isPending}>
        Salvar link
      </Button>
    </form>
  );
}

