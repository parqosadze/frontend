import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Heading from "@/components/ui/heading";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { loginFormSchema } from "@/schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@/react-query/mutation/auth";
import { afterSignInSuccess } from "../utils";
import { useQueryClient } from "@tanstack/react-query";
const LoginForm: React.FC = () => {
  const queryClient = useQueryClient();
  type UserForm = z.infer<typeof loginFormSchema>;
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { email: "", password: "" },
  });
  const { mutate: handleSignIn } = useSignIn();
  const onSubmit: SubmitHandler<UserForm> = (data) => {
    handleSignIn(
      { payload: data },
      {
        onSuccess: (res) => {
          afterSignInSuccess({
            accessToken: res.access,
            refreshToken: res.refresh,
          });
          queryClient.invalidateQueries({ queryKey: ["me"] });
          navigate("/home");
        },
      },
    );
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-6">
        <div>
          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input id="email" placeholder="Email" {...field} />
            )}
          />
          {errors.email?.message && (
            <span className="text-red-600 font-semibold text-xs sm:text-sm md:text-base">
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <Controller
            control={control}
            name="password"
            render={({ field }) => (
              <Input
                id="password"
                placeholder="Password"
                {...field}
                type="password"
              />
            )}
          />
          {errors.password?.message && (
            <span className="text-red-600 font-semibold text-xs sm:text-sm md:text-base">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>
      <Button className="w-full my-6">Login</Button>
      <div className="flex items-center gap-4 justify-center">
        <Heading level={3}>Don't have an account?</Heading>
        <Link className="text-blue-700 font-semibold" to="/register">
          Sign Up
        </Link>
      </div>
    </form>
  );
};
export default LoginForm;
