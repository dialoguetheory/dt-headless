import { useState } from 'react';
import classNames from 'classnames/bind';
import Link from 'next/link';
import { Container, MegaMenu, SkipNavigationLink } from '../../components';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

export default function Header({ title = 'Headless by WP Engine', description, menuItems }) {
  const [isNavShown, setIsNavShown] = useState(false);

  const toggleNavigation = () => setIsNavShown((prev) => !prev);

  return (
    <header className={cx('component')}>
      <SkipNavigationLink />

      <Container className={cx('grid', 'grid--full')}>
        <div className={cx('navbar', 'col-2-span-1')}>
          {/* Branding */}
          <div className={cx('brand')}>
            <Link href="/" legacyBehavior>
              <a className={cx('title')}>{title}</a>
            </Link>
            {description && <p className={cx('description')}>{description}</p>}
          </div>

          {/* Navigation Toggle */}
          <button
            type="button"
            className={cx('nav-toggle')}
            onClick={toggleNavigation}
            aria-label={isNavShown ? 'Close navigation' : 'Open navigation'}
            aria-controls="primary-navigation"
            aria-expanded={isNavShown}
          >
            ☰
          </button>

          {/* Navigation Menu */}
          <MegaMenu
            id="primary-navigation"
            className={cx('primary-navigation', { show: isNavShown })}
            menuItems={menuItems}
          />
        </div>
      </Container>
    </header>
  );
}
