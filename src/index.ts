/**
 * @julienfernandes/ds — Design System Julien Fernandes.
 *
 * Les styles sont un import séparé :
 *   import '@julienfernandes/ds/styles.css';
 *
 * Le preset Tailwind :
 *   import preset from '@julienfernandes/ds/preset';
 */

/* icons */
export { Icon } from './components/icons/Icon';
export type { IconProps, IconName } from './components/icons/Icon';

/* actions */
export { Button } from './components/actions/Button';
export type { ButtonProps } from './components/actions/Button';
export { IconButton } from './components/actions/IconButton';
export type { IconButtonProps } from './components/actions/IconButton';

/* forms */
export { Input } from './components/forms/Input';
export type { InputProps } from './components/forms/Input';
export { Textarea } from './components/forms/Textarea';
export type { TextareaProps } from './components/forms/Textarea';
export { Select } from './components/forms/Select';
export type { SelectProps, SelectOption } from './components/forms/Select';
export { Checkbox } from './components/forms/Checkbox';
export type { CheckboxProps } from './components/forms/Checkbox';
export { Radio } from './components/forms/Radio';
export type { RadioProps } from './components/forms/Radio';
export { Switch } from './components/forms/Switch';
export type { SwitchProps } from './components/forms/Switch';
export { FormField } from './components/forms/FormField';
export type { FormFieldProps } from './components/forms/FormField';

/* data-display */
export { Card } from './components/data-display/Card';
export type { CardProps } from './components/data-display/Card';
export { Badge } from './components/data-display/Badge';
export type { BadgeProps } from './components/data-display/Badge';
export { Tooltip } from './components/data-display/Tooltip';
export type { TooltipProps } from './components/data-display/Tooltip';

/* feedback */
export { Toast } from './components/feedback/Toast';
export type { ToastProps } from './components/feedback/Toast';
export { Banner } from './components/feedback/Banner';
export type { BannerProps } from './components/feedback/Banner';
export { EmptyState } from './components/feedback/EmptyState';
export type { EmptyStateProps } from './components/feedback/EmptyState';
export { Skeleton } from './components/feedback/Skeleton';
export type { SkeletonProps } from './components/feedback/Skeleton';
export { SkeletonCard } from './components/feedback/SkeletonCard';
export type { SkeletonCardProps } from './components/feedback/SkeletonCard';

/* overlays */
export { Modal } from './components/overlays/Modal';
export type { ModalProps } from './components/overlays/Modal';
export { Dropdown } from './components/overlays/Dropdown';
export type { DropdownProps, DropdownItem } from './components/overlays/Dropdown';

/* navigation */
export { Navbar } from './components/navigation/Navbar';
export type { NavbarProps, NavLink } from './components/navigation/Navbar';
export { Footer } from './components/navigation/Footer';
export type { FooterProps, FooterColumn } from './components/navigation/Footer';
export { Tabs } from './components/navigation/Tabs';
export type { TabsProps, TabItem } from './components/navigation/Tabs';

/* brand */
export { Logo } from './components/brand/Logo';
export type { LogoProps } from './components/brand/Logo';
export { Halo } from './components/brand/Halo';
export type { HaloProps } from './components/brand/Halo';
export { GridBackground } from './components/brand/GridBackground';
export type { GridBackgroundProps } from './components/brand/GridBackground';
export { Avatar } from './components/brand/Avatar';
export type { AvatarProps } from './components/brand/Avatar';

/* utilitaire de composition de classes */
export { cn } from './lib/cn';
export type { ClassValue } from './lib/cn';
