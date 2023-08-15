import React from 'react'
import { TouchableOpacity, Text } from 'react-native'

interface Props {
	title: string
	action: () => void
	disabled: boolean
}

function Button({ title, action, disabled }: Props) {
	return (
		<TouchableOpacity onPress={action} className="bg-gray-300 w-1/2 self-center m-4 p-2 rounded-lg" disabled={disabled}>
			<Text className="self-center text-lg">{title}</Text>
		</TouchableOpacity>
	)
}

export default Button
