// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <AuthLayout title="Weryfikacja adresu e-mail" description="Proszę zweryfikować swój adres e-mail, klikając w link, który właśnie wysłaliśmy na Twój adres e-mail.">
            <Head title="Weryfikacja adresu e-mail" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Nowy link weryfikacyjny został wysłany na adres e-mail podany podczas rejestracji.
                </div>
            )}

            <form onSubmit={submit} className="space-y-6 text-center">
                <Button disabled={processing} variant="secondary">
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                    Wyślij ponownie link weryfikacyjny
                </Button>

                <TextLink href={route('logout')} method="post" className="mx-auto block text-sm">
                    Wyloguj się
                </TextLink>
            </form>
        </AuthLayout>
    );
}
