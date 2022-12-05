import clsxm from '@/lib/clsxm';

export type ButtonProps = React.ComponentPropsWithoutRef<'input'>;

const Input = ({ className, ...rest }: ButtonProps) => {
  return (
    <input
      type='text'
      className={clsxm('rounded-lg py-2 px-4', className)}
      {...rest}
    />
  );
};

export default Input;
