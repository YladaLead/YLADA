import React from 'react';
import { herbaleadLogos, LogoProps } from './config';

/**
 * HerbaLead Logo Component
 * 
 * Usage examples:
 * <HerbaLeadLogo variant="horizontal" className="h-12" />
 * <HerbaLeadLogo variant="iconOnly" className="w-8 h-8" />
 * <HerbaLeadLogo variant="dark" className="h-10" />
 */
export const HerbaLeadLogo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = 'h-8 w-auto',
  alt = 'HerbaLead - Your Lead Accelerator',
  width,
  height,
  ...props
}) => {
  const logoSrc = herbaleadLogos[variant];
  
  return (
    <img
      src={logoSrc}
      alt={alt}
      className={className}
      width={width}
      height={height}
      {...props}
    />
  );
};

/**
 * HerbaLead Icon Component
 * Simplified component for icon-only usage
 */
export const HerbaLeadIcon: React.FC<Omit<LogoProps, 'variant'>> = ({
  className = 'w-8 h-8',
  alt = 'HerbaLead',
  ...props
}) => {
  return (
    <HerbaLeadLogo
      variant="iconOnly"
      className={className}
      alt={alt}
      {...props}
    />
  );
};

/**
 * Responsive Logo Component
 * Automatically switches between horizontal and icon based on screen size
 */
export const ResponsiveHerbaLeadLogo: React.FC<Omit<LogoProps, 'variant'>> = ({
  className = 'h-8 w-auto',
  ...props
}) => {
  return (
    <>
      {/* Desktop - Horizontal Logo */}
      <HerbaLeadLogo
        variant="horizontal"
        className={`hidden md:block ${className}`}
        {...props}
      />
      
      {/* Mobile - Icon Only */}
      <HerbaLeadLogo
        variant="iconOnly"
        className={`block md:hidden ${className}`}
        {...props}
      />
    </>
  );
};

export default HerbaLeadLogo;












