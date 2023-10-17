/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{js,ts,svelte}'],
	theme: {
		extend: {
			colors: {
				background: {
					50: '#E9EDF6',
					100: '#D7DEEF',
					200: '#ABBADE',
					300: '#8399CE',
					400: '#5A78BE',
					500: '#3E5B9D',
					600: '#2E4375',
					700: '#1D2A49',
					800: '#0D1321',
					900: '#070B12',
					950: '#030407'
				},
				primary: {
					50: '#F5F7F3',
					100: '#EBEEE7',
					200: '#D5DBCC',
					300: '#C1CAB5',
					400: '#AAB79A',
					500: '#96A682',
					600: '#82956A',
					700: '#6B7A57',
					800: '#566246',
					900: '#2A3022',
					950: '#151811'
				},
				secondary: {
					50: '#F9F1F1',
					100: '#F3E4E2',
					200: '#E8CCC9',
					300: '#DCB1AD',
					400: '#D19994',
					500: '#C57E77',
					600: '#BA665E',
					700: '#A85048',
					800: '#8E443D',
					900: '#47221F',
					950: '#24110F'
				},
				white: {
					50: '#FAF9FA',
					100: '#F5F4F6',
					200: '#EAE9EC',
					300: '#E0DEE3',
					400: '#D5D3DA',
					500: '#CBC8D0',
					600: '#C0BCC7',
					700: '#B8B4C0',
					800: '#ADA8B6',
					900: '#544F5E',
					950: '#2A282F'
				},
				foreground: {
					50: '#FEFDFB',
					100: '#FBF9F4',
					200: '#F8F5ED',
					300: '#F4F0E2',
					400: '#F0EBD8',
					500: '#DCCFA3',
					600: '#C6B36C',
					700: '#A69040',
					800: '#6E602B',
					900: '#373015',
					950: '#1A160A'
				}
			},
			fontSize: {
				'3xl': '50px',
				'2xl': '30px',
				xl: '25px',
				lg: '20px',
				md: '14px',
				sm: '12px',
				xs: '10px'
			}
		}
	},
	plugins: []
};
