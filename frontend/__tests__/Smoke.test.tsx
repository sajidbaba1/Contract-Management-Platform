import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

describe('Smoke Test', () => {
    it('renders a heading', () => {
        render(<h1 data-testid="title">Contract Dashboard</h1>)
        const heading = screen.getByTestId('title')
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('Contract Dashboard')
    })
})
