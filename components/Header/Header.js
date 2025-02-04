import classNames from 'classnames/bind';
import Link from 'next/link';
import * as MENUS from '../../constants/menus';
import { MegaMenu, MobileMenu, NavigationMenu, SkipNavigationLink } from '../../components';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

export default function Header({ title, description, menuItems }) {

  return (
    <header className={`${cx('site-header')} grid grid--full`}>
      <SkipNavigationLink />
      <div id="js-site-logo" className={`${cx('site-logo')} col-2-span-3 row-1-span-1`}>
        <Link href="/" legacyBehavior>
          <a className={cx('title')}>{title}</a>
        </Link>
        {description && <p className={cx('description')}>{description}</p>}
      </div>
      {menuItems && menuItems.length > 0 && (
        <div className={`${cx('navbar')} col-5-span-9 row-1-span-1`}>
          <MegaMenu
            location={MENUS.PRIMARY_LOCATION}
            className={`${cx('primary-navigation')} visible@md`}
          />
          <MobileMenu
            location={MENUS.PRIMARY_LOCATION}
            className={cx('primary-navigation-mobile')}
            ariaControls={'primary-navigation-mobile'}
          />
        </div>
      )}
    </header>
  );
}
