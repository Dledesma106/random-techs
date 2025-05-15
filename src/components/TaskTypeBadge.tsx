import { TaskType } from '@/api/graphql';
import { Badge, BadgeText } from '@/components/ui/badge';
import { pascalCaseToSpaces } from '@/lib/utils';

type TaskTypeBadgeProps = {
    type: TaskType;
    className?: string;
    textClassName?: string;
};

const getTaskTypeColor = (type: TaskType) => {
    switch (type) {
        case TaskType.Preventivo:
            return 'bg-green-500';
        case TaskType.Correctivo:
            return 'bg-red-500';
        case TaskType.Instalacion:
            return 'bg-blue-500';
        case TaskType.Desmonte:
            return 'bg-yellow-500';
        case TaskType.Actualizacion:
            return 'bg-purple-500';
        case TaskType.InspeccionPolicial:
            return 'bg-orange-500';
        default:
            return 'bg-gray-500';
    }
};

const TaskTypeBadge = ({ type, className, textClassName }: TaskTypeBadgeProps) => {
    const color = getTaskTypeColor(type);

    return (
        <Badge className={`${color} ${className ?? ''}`}>
            <BadgeText className={`text-white ${textClassName ?? ''}`}>
                {pascalCaseToSpaces(type)}
            </BadgeText>
        </Badge>
    );
};

export default TaskTypeBadge;
