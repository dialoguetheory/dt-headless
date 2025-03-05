import { useQuery, gql } from '@apollo/client';
import AnchorLinks from '../../utils/anchors';

const FOOTER_QUERY = gql`
  query FooterQuery {
    themeGeneralOptions {
      themeOptionsGeneral {
        postCopyrightText
      }
    }
  }
`;

const SiteFooter = ({ footerMenu }) => {
    const { loading, error, data } = useQuery(FOOTER_QUERY);

    if (loading) return null;
    if (error) {
        console.error('Error fetching footer data:', error);
        return null;
    }
    
    const postCopyrightText = data?.themeGeneralOptions?.themeOptionsGeneral?.postCopyrightText;
  
    return (
        <>
            <footer className="site-footer">
            {footerMenu?.length > 0 && (
                <nav className="footer-navigation">
                <ul>
                    {footerMenu.map((menuItem) => (
                    <li key={menuItem.id}>{menuItem.label}</li>
                    ))}
                </ul>
                </nav>
            )}
            {postCopyrightText && (
                <div className="copyright">
                    <p>{postCopyrightText}</p>
                </div>
            )}
            </footer>
            <AnchorLinks />
        </>
    );
}

export default SiteFooter;