import { NavbarAdmin } from '../../components/base/NavbarAdmin';
import AddMovieDialog from '../../components/layout/Addmoviex';

const ManageMovie = () => {
  return (
    <div className="pt-16">
      <NavbarAdmin />
      <AddMovieDialog onAdded={() => console.log('Refresh movie list')} />
    </div>
  );
};
export default ManageMovie;
