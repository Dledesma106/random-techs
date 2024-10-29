import { RefreshControl, ScrollView } from 'react-native';

type Props = {
    isRefreshing: boolean;
    onRefresh: () => void;
    children?: React.ReactNode;
};

const RefreshableScroll = ({ isRefreshing, onRefresh, children }: Props) => {
    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            className="bg-white flex-1"
        >
            {children}
        </ScrollView>
    );
};

export default RefreshableScroll;
