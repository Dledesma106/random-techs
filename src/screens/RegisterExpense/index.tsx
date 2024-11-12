import { ExpenseInput } from '@/api/graphql';
import ExpenseForm from '@/components/Forms/ExpenseForm';
import { useCreateExpense } from '@/hooks/api/expense/useCreateExpense';

const RegisterExpense = () => {
    const { mutateAsync: createExpense } = useCreateExpense();
    const onFinish = async (expenseData: ExpenseInput) => {
        await createExpense({ taskId: '', expenseData });
    };

    return <ExpenseForm onFinish={onFinish} />;
};

export default RegisterExpense;
