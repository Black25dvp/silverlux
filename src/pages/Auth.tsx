import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';

const authSchema = z.object({
  email: z.string().trim().email({ message: 'Email inválido' }).max(255),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }).max(100)
});

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validated = authSchema.parse({ email, password });
      setLoading(true);

      if (isLogin) {
        const { error } = await signIn(validated.email, validated.password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Email ou senha incorretos');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Login realizado com sucesso!');
          navigate('/');
        }
      } else {
        const { error } = await signUp(validated.email, validated.password);

        if (error) {
          toast.error('Erro ao criar conta: ' + error.message);
        } else {
          toast.success('Conta criada com sucesso!');
          navigate('/');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach(err => toast.error(err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-background px-4 pt-20">
        <Card className="w-full max-w-md p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-foreground">
              {isLogin ? 'Bem-vindo de volta' : 'Criar sua conta'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin ? 'Entre com suas credenciais para continuar' : 'Preencha os dados para criar sua conta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="••••••••"
                />
                {!isLogin && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo de 6 caracteres
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta')}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? (
                <>
                  Não tem uma conta? <span className="text-accent font-medium">Criar conta</span>
                </>
              ) : (
                <>
                  Já tem uma conta? <span className="text-accent font-medium">Entrar</span>
                </>
              )}
            </button>
          </div>
        </Card>
      </div>
    </>
  );
};

export default Auth;
