// src/components/Team/PlayerInfoModal.jsx
import Modal from '../../submodule/ui/Modal/Modal';
import PlayerInfo from '../PlayerInfo/PlayerInfo';

const PlayerInfoModal = ({ open, onClose, player }) => {
  if (!player) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={player.playerName}
      maxWidth="lg"
    >
      <PlayerInfo playerId={player.id} />
    </Modal>
  );
};

export default PlayerInfoModal;