'use client';

import { useEffect } from 'react';

/**
 * Hook to initialize IntersectionObserver for elements with the .reveal class.
 * Accepts a dependency array to re-run the observer logic when dynamic content loads.
 */
export function useScrollReveal(dependencies: React.DependencyList = []) {
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, we can stop observing if we don't want repeat animations
          // observer.unobserve(entry.target); 
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, dependencies); // Re-run when dependencies change
}
