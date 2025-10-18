/**
 * Tests unitaires pour LoadingSpinner
 * Conforme référentiel DWWM 2023
 */

import { render, screen } from "@testing-library/react";
import LoadingSpinner from "../LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("loading-spinner");
    expect(spinner).toHaveAttribute("aria-label", "Chargement en cours");
  });

  it("renders with custom size", () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("renders with custom text", () => {
    render(<LoadingSpinner text="Chargement des données..." />);

    expect(screen.getByText("Chargement des données...")).toBeInTheDocument();
  });

  it("renders with custom className", () => {
    render(<LoadingSpinner className="custom-class" />);

    const container = screen.getByRole("status").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("renders different sizes correctly", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("h-4", "w-4");

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole("status")).toHaveClass("h-8", "w-8");

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("h-12", "w-12");

    rerender(<LoadingSpinner size="xl" />);
    expect(screen.getByRole("status")).toHaveClass("h-16", "w-16");
  });

  it("has proper accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Chargement en cours");

    const srOnlyText = screen.getByText("Chargement...");
    expect(srOnlyText).toHaveClass("sr-only");
  });
});



