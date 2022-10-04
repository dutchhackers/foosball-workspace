import { PlayerService } from '@foosball/api/common';
import { Controller, Get } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @Get()
  getData() {
    return this.playerService.getPlayers();
  }

  // playerRouter.get('/:id?', async (req, res) => {
  //   const playerService = new PlayerService(Firestore.db);

  //   try {
  //     let response;
  //     const playerId = req.params.id;
  //     if (playerId) {
  //       response = await playerService.getPlayer(playerId);
  //     } else {
  //       response = await playerService.getPlayers();
  //     }
  //     res.status(200).json(response);
  //   } catch {
  //     res.status(400).json('Bad request');
  //   }
  // });

  // playerRouter.post('/', async (req, res) => {
  //   const playerService = new PlayerService(Firestore.db);

  //   try {
  //     let response;

  //     const createPlayerInput: Partial<IPlayer> = req.body;
  //     response = await playerService.addPlayer(createPlayerInput);

  //     res.status(200).json(response);
  //   } catch {
  //     res.status(400).json('Bad request');
  //   }
  // });

  // playerRouter.put('/:id', async (req, res) => {
  //   const playerService = new PlayerService(Firestore.db);

  //   try {
  //     let response;

  //     const updatePlayerInput: Partial<IPlayer> = req.body;
  //     const id = req.params.id;
  //     if (id) {
  //       response = await playerService.updatePlayer(id, updatePlayerInput);
  //       res.status(200).json(response);
  //       return;
  //     }
  //   } catch {}
  //   res.status(400).json('Bad request');
  // });
}
