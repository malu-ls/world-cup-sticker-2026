// Bandeiras via flagcdn.com — funciona em todos os SOs incluindo Windows
// iso2 = código ISO 3166-1 alpha-2 em minúsculo
export function getFlagUrl(iso2) {
  if (!iso2) return null
  return `https://flagcdn.com/w40/${iso2.toLowerCase()}.png`
}

// ─── SEÇÕES ESPECIAIS (na ordem exata do álbum) ─────────────────────────────
export const SPECIAL_SECTIONS = [
  {
    code: 'FWC_OPEN',
    name: 'Abertura da Copa',
    icon: '🏆',
    stickers: [
      { code: 'FWC1', name: 'Emblema Oficial', special: true },
      { code: 'FWC2', name: 'Emblema Oficial 2', special: true },
      { code: 'FWC3', name: 'Mascote Oficial', special: true },
      { code: 'FWC4', name: 'Slogan Oficial', special: true },
      { code: 'FWC5', name: 'Bola Oficial', special: true },
      { code: 'FWC6', name: 'Canadá — Países-Sede', special: true },
      { code: 'FWC7', name: 'México — Países-Sede', special: true },
      { code: 'FWC8', name: 'USA — Países-Sede', special: true },
    ]
  },
  {
    // Museu FIFA: FWC9 a FWC19 — visível na foto do álbum
    code: 'FWC_MUS',
    name: 'Museu FIFA — Campeões do Mundo',
    icon: '🏛️',
    stickers: [
      // Somente posições COM código FWC visível nas fotos do álbum
      { code: 'FWC9',  name: 'Itália 1934', special: true },
      { code: 'FWC10', name: 'Brasil 1950', special: true },
      { code: 'FWC11', name: 'Suíça 1954', special: true },
      { code: 'FWC12', name: 'Chile 1962', special: true },
      { code: 'FWC13', name: 'Alemanha 1974', special: true },
      { code: 'FWC14', name: 'México 1986', special: true },
      { code: 'FWC15', name: 'EUA 1994', special: true },
      { code: 'FWC16', name: 'Coreia/Japão 2002', special: true },
      { code: 'FWC17', name: 'Alemanha 2006', special: true },
      { code: 'FWC18', name: 'Brasil 2014', special: true },
      { code: 'FWC19', name: 'Qatar 2022', special: true },
    ]
  },
  {
    code: 'FWC_COCA',
    name: 'Coca-Cola Exclusivas',
    icon: '🥤',
    stickers: [
      { code: 'CC1',  name: 'Lamine Yamal — Espanha', special: true },
      { code: 'CC2',  name: 'Joshua Kimmich — Alemanha', special: true },
      { code: 'CC3',  name: 'Virgil van Dijk — Holanda', special: true },
      { code: 'CC4',  name: 'Antonee Robinson — USA', special: true },
      { code: 'CC5',  name: 'Alphonso Davies — Canadá', special: true },
      { code: 'CC6',  name: 'Lautaro Martínez — Argentina', special: true },
      { code: 'CC7',  name: 'Harry Kane — Inglaterra', special: true },
      { code: 'CC8',  name: 'Edson Álvarez — México', special: true },
      { code: 'CC9',  name: 'Weston McKennie — USA', special: true },
      { code: 'CC10', name: 'Jefferson Lerma — Colômbia', special: true },
      { code: 'CC11', name: 'Santiago Giménez — México', special: true },
      { code: 'CC12', name: 'Gabriel Magalhães — Brasil', special: true },
    ]
  },
]

// ─── SELEÇÕES (ordem do álbum: por grupo A→L) ────────────────────────────────
export const TEAMS = [
  // GRUPO A
  { code: 'MEX', name: 'México',              iso2: 'mx', group: 'A',
    players: ['Luis Malagón', 'Johan Vásquez', 'Jorge Sánchez', 'César Montes', 'Jesús Gallardo', 'Israel Reves', 'Diego Lainez', 'Carlos Rodríguez', 'Edson Álvarez', 'Orbelin Pineda', 'Marcel Ruiz', 'Foto do Time', 'Érick Sánchez', 'Hirving Lozano', 'Santiago Giménez', 'Raúl Jiménez', 'Alexis Vega', 'Roberto Alvarado', 'César Huerta'] },
  { code: 'RSA', name: 'África do Sul',       iso2: 'za', group: 'A',
    players: ['Ronwen Williams', 'Sipho Chaine', 'Aubrey Modiba', 'Samukele Kabini', 'Mbekezeli Mbokazi', 'Khulumani Ndamane', 'Siyabonga Ngezana', 'Khuliso Mudau', 'Nkosinathi Sibisi', 'Teboho Mokoena', 'Thalente Mbatha', 'Foto do Time', 'Bathusi Aubaas', 'Yaya Sithole', 'Sipho Mbule', 'Lyle Foster', 'Iqraam Ravners', 'Mohau Nkota', 'Oswin Appollis'] },
  { code: 'KOR', name: 'Coreia do Sul',       iso2: 'kr', group: 'A',
    players: ['Hyeon-woo Jo', 'Seung-Gyu Kim', 'Min-jae Kim', 'Yu-min Cho', 'Young-woo Seol', 'Han-beom Lee', 'Tae-seok Lee', 'Myung-jae Lee', 'Jae-sung Lee', 'In-beom Hwang', 'Kang-in Lee', 'Foto do Time', 'Seung-ho Paik', 'Jens Castrop', 'Dong-gyeong Lee', 'Gue-sung Cho', 'Heung-min Son', 'Hee-chan Hwang', 'Hyeon-Gyu Oh'] },
  { code: 'CZE', name: 'Tchéquia',            iso2: 'cz', group: 'A',
    players: ['Matěj Kovář', 'Jindřich Staněk', 'Ladislav Krejčí', 'Vladimír Coufal', 'Jaroslav Zelený', 'Tomáš Holeš', 'David Zima', 'Michal Sadílek', 'Lukáš Provod', 'Lukáš Červ', 'Tomáš Souček', 'Foto do Time', 'Pavel Šulc', 'Matěj Vydra', 'Vasil Kušej', 'Tomáš Chorý', 'Václav Černý', 'Adam Hložek', 'Patrik Schick'] },
  // GRUPO B
  { code: 'CAN', name: 'Canadá',              iso2: 'ca', group: 'B',
    players: ['Dayne St. Clair', 'Alphonso Davies', 'Alistair Johnston', 'Samuel Adekugbe', 'Richie Larvea', 'Derek Cornelius', 'Moïse Bombito', 'Kamal Miller', 'Stephen Eustáquio', 'Ismaël Koné', 'Jonathan Osorio', 'Foto do Time', 'Jacob Shaffelburg', 'Mathieu Choinière', 'Niko Sigur', 'Tajon Buchanan', 'Liam Millar', 'Cyle Larin', 'Jonathan David'] },
  { code: 'BIH', name: 'Bósnia e Herzegovina',iso2: 'ba', group: 'B',
    players: ['Nikola Vasilj', 'Amar Dedić', 'Sead Kolašinac', 'Tarik Muharemović', 'Nihad Mujakić', 'Nikola Katić', 'Amir Kadžiahmetović', 'Benjamin Tahirović', 'Armin Gigović', 'Ivan Šunjić', 'Ivan Bašić', 'Foto do Time', 'Dženis Burnić', 'Esmir Bajraktarević', 'Amar Memić', 'Ermedin Demirović', 'Edin Džeko', 'Samed Baždar', 'Haris Tabaković'] },
  { code: 'QAT', name: 'Catar',               iso2: 'qa', group: 'B',
    players: ['Meshaal Barsham', 'Sultan Albrake', 'Lucas Mendes', 'Homam Ahmed', 'Boualem Khoukhi', 'Pedro Miguel', 'Tarek Salman', 'Mohammed Mannai', 'Karim Boudiaf', 'Assim Madibo', 'Hamed Fatehi', 'Foto do Time', 'Mohammed Waad', 'Abdulaziz Hatem', 'Hassan Al-Haydos', 'Edmilson Junior', 'Akram Hassan Afif', 'Ahmed Al-Ganehi', 'Almoez Ali'] },
  { code: 'SUI', name: 'Suíça',               iso2: 'ch', group: 'B',
    players: ['Gregor Kobel', 'Yvon Mvogo', 'Manuel Akanji', 'Ricardo Rodríguez', 'Nico Elvedi', 'Aurèle Amenda', 'Silvan Widmer', 'Granit Xhaka', 'Denis Zakaria', 'Remo Freuler', 'Fabian Rieder', 'Foto do Time', 'Ardon Jashari', 'Johan Manzambi', 'Michel Aebischer', 'Breel Embolo', 'Rubén Vargas', 'Dan Ndove', 'Zeki Amdouni'] },
  // GRUPO C
  { code: 'BRA', name: 'Brasil',              iso2: 'br', group: 'C',
    players: ['Alisson', 'Bento', 'Marquinhos', 'Éder Militão', 'Gabriel Magalhães', 'Danilo', 'Wesley', 'Lucas Paquetá', 'Casemiro', 'Bruno Guimarães', 'Luiz Henrique', 'Foto do Time', 'Vinícius Júnior', 'Rodrygo', 'João Pedro', 'Matheus Cunha', 'Gabriel Martinelli', 'Raphinha', 'Estêvão'] },
  { code: 'MAR', name: 'Marrocos',            iso2: 'ma', group: 'C',
    players: ['Yassine Bounou', 'Munir El Kajoui', 'Achraf Hakimi', 'Noussair Mazraoui', 'Nayef Aguerd', 'Romain Saïss', 'Jawad El Yamiq', 'Adam Masina', 'Sofyan Amrabat', 'Azzedine Ounahi', 'Eliesse Ben Seghir', 'Foto do Time', 'Bilal El Khannouss', 'Ismael Saibari', 'Youssef En-Nesyri', 'Abde Ezzalzouli', 'Soufiane Rahimi', 'Brahim Díaz', 'Ayoub El Kaabi'] },
  { code: 'HAI', name: 'Haiti',               iso2: 'ht', group: 'C',
    players: ['Johny Placide', 'Carlens Arcus', 'Martin Expérience', 'Jean-Kévin Duverne', 'Ricardo Adé', 'Duke Lacroix', 'Garven Metusala', 'Hannes Delcroix', 'Leverton Pierre', 'Danley Jean Jacques', 'Jean-Ricner Bellegarde', 'Foto do Time', 'Christopher Attys', 'Derrick Etienne Jr', 'Josue Casimir', 'Ruben Providence', 'Duckens Nazon', 'Louicius Deedson', 'Frantzen Pierrot'] },
  { code: 'SCO', name: 'Escócia',             iso2: 'gb-sct', group: 'C',
    players: ['Angus Gunn', 'Jack Hendry', 'Kieran Tierney', 'Aaron Hickey', 'Andrew Robertson', 'Scott McKenna', 'John Souttar', 'Anthony Ralston', 'Grant Hanley', 'Scott McTominay', 'Billy Gilmour', 'Foto do Time', 'Lewis Ferguson', 'Ryan Christie', 'Kenny McLean', 'John McGinn', 'Lyndon Dykes', 'Che Adams', 'Ben Gannon-Doak'] },
  // GRUPO D
  { code: 'USA', name: 'Estados Unidos',      iso2: 'us', group: 'D',
    players: ['Matt Freese', 'Chris Richards', 'Tim Ream', 'Mark McKenzie', 'Alex Freeman', 'Antonee Robinson', 'Tyler Adams', 'Tanner Tessmann', 'Weston McKennie', 'Cristian Roldan', 'Timothy Weah', 'Foto do Time', 'Diego Luna', 'Malik Tillman', 'Christian Pulisic', 'Brenden Aaronson', 'Ricardo Pepi', 'Haji Wright', 'Folarin Balogun'] },
  { code: 'PAR', name: 'Paraguai',            iso2: 'py', group: 'D',
    players: ['Roberto Fernández', 'Orlando Gill', 'Gustavo Gómez', 'Fabián Balbuena', 'Juan José Cáceres', 'Omar Alderete', 'Junior Alonso', 'Mathías Villasanti', 'Diego Gómez', 'Damián Bobadilla', 'Andrés Cubas', 'Foto do Time', 'Matías Galarza Fonda', 'Julio Enciso', 'Alejandro Romero Gamarra', 'Miguel Almirón', 'Ramón Sosa', 'Ángel Romero', 'Antonio Sanabria'] },
  { code: 'AUS', name: 'Austrália',           iso2: 'au', group: 'D',
    players: ['Mathew Ryan', 'Joe Gauci', 'Harry Souttar', 'Alessandro Circati', 'Jordan Bos', 'Aziz Behich', 'Cameron Burgess', 'Lewis Miller', 'Milos Degenek', 'Jackson Irvine', 'Riley McGree', 'Foto do Time', 'Aiden O\'Neill', 'Connor Metcalfe', 'Patrick Yazbek', 'Craig Goodwin', 'Kusini Vengi', 'Nestory Irankunda', 'Mohamed Touré'] },
  { code: 'TUR', name: 'Turquia',             iso2: 'tr', group: 'D',
    players: ['Uğurcan Çakır', 'Mert Müldür', 'Zeki Çelik', 'Abdülkerim Bardakcı', 'Çağlar Sövüncü', 'Merih Demiral', 'Ferdi Kadıoğlu', 'Kaan Avhan', 'İsmail Yüksek', 'Hakan Çalhanoğlu', 'Orkun Kökçü', 'Foto do Time', 'Arda Güler', 'İrfan Can Kahveci', 'Yunus Akgün', 'Can Uzun', 'Barış Alper Yılmaz', 'Kerem Aktürkoglu', 'Kenan Yıldız'] },
  // GRUPO E
  { code: 'GER', name: 'Alemanha',            iso2: 'de', group: 'E',
    players: ['Marc-André ter Stegen', 'Jonathan Tah', 'David Raum', 'Nico Schlotterbeck', 'Antonio Rüdiger', 'Waldemar Anton', 'Ridle Baku', 'Maximilian Mittelstädt', 'Joshua Kimmich', 'Florian Wirtz', 'Felix Nmecha', 'Foto do Time', 'Leon Goretzka', 'Jamal Musiala', 'Serge Gnabry', 'Kai Havertz', 'Leroy Sané', 'Karim Adeyemi', 'Nick Woltemade'] },
  { code: 'CUW', name: 'Curaçao',             iso2: 'cw', group: 'E',
    players: ['Eloy Room', 'Armando Obispo', 'Sherel Floranus', 'Jurién Gaari', 'Joshua Brenet', 'Roshon Van Eijma', 'Shurandy Sambo', 'Livano Comenencia', 'Godfried Roemeratoe', 'Juninho Bacuna', 'Leandro Bacuna', 'Foto do Time', 'Tahith Chong', 'Kenji Gorré', 'Jearl Margaritha', 'Jurgen Locadia', 'Jeremy Antonisse', 'Gervane Kastaneer', 'Sontje Hansen'] },
  { code: 'CIV', name: 'Costa do Marfim',     iso2: 'ci', group: 'E',
    players: ['Vahia Fofana', 'Ghislain Konan', 'Wilfried Singo', 'Odilon Kossounou', 'Evan Ndicka', 'Willy Boly', 'Emmanuel Agbadou', 'Ousmane Diomande', 'Franck Kessié', 'Seko Fofana', 'Ibrahim Sangaré', 'Foto do Time', 'Jean-Philippe Gbamin', 'Amad Diallo', 'Sébastien Haller', 'Simon Adingra', 'Yan Diomande', 'Evann Guessand', 'Oumar Diakité'] },
  { code: 'ECU', name: 'Equador',             iso2: 'ec', group: 'E',
    players: ['Hernán Galíndez', 'Gonzalo Valle', 'Piero Hincapié', 'Pervis Estupiñán', 'Willian Pacho', 'Ángelo Preciado', 'Joel Ordóñez', 'Moisés Caicedo', 'Alan Franco', 'Kendry Páez', 'Pedro Vite', 'Foto do Time', 'John Veboah', 'Leonardo Campana', 'Gonzalo Plata', 'Nilson Angulo', 'Alan Minda', 'Kevin Rodríguez', 'Enner Valencia'] },
  // GRUPO F
  { code: 'NED', name: 'Holanda',             iso2: 'nl', group: 'F',
    players: ['Bart Verbruggen', 'Virgil Van Dijk', 'Micky Van de Ven', 'Jurriën Timber', 'Denzel Dumfries', 'Nathan Aké', 'Jeremie Frimpong', 'Jan Paul Van Hecke', 'Tijjani Reijnders', 'Ryan Gravenberch', 'Teun Koopmeiners', 'Foto do Time', 'Frenkie De Jong', 'Xavi Simons', 'Justin Kluivert', 'Memphis Depay', 'Donyell Malen', 'Wout Weghorst', 'Cody Gakpo'] },
  { code: 'JPN', name: 'Japão',               iso2: 'jp', group: 'F',
    players: ['Zion Suzuki', 'Henry Heroki Mochizuki', 'Ayumu Seko', 'Junnosuke Suzuki', 'Shogo Taniguchi', 'Tsuyoshi Watanabe', 'Kaishu Sano', 'Yuki Soma', 'Ao Tanaka', 'Daichi Kamada', 'Takefusa Kubo', 'Foto do Time', 'Ritsu Doan', 'Keito Nakamura', 'Takumi Minamino', 'Shoto Machino', 'Junya Ito', 'Koki Ogawa', 'Ayase Ueda'] },
  { code: 'SWE', name: 'Suécia',              iso2: 'se', group: 'F',
    players: ['Viktor Johansson', 'Isak Hien', 'Gabriel Gudmundsson', 'Emil Holm', 'Victor Nilsson Lindelöf', 'Gustaf Lagerbielke', 'Lucas Bergvall', 'Hugo Larsson', 'Jesper Karlström', 'Yasin Avari', 'Mattias Svanberg', 'Foto do Time', 'Daniel Svensson', 'Ken Sema', 'Roony Bardghji', 'Dejan Kulusevski', 'Anthony Elanga', 'Alexander Isak', 'Viktor Gyökeres'] },
  { code: 'TUN', name: 'Tunísia',             iso2: 'tn', group: 'F',
    players: ['Bechir Ben Saïd', 'Aymen Dahmen', 'Yan Valery', 'Montassar Talbi', 'Yassine Meriah', 'Ali Abdi', 'Dylan Bronn', 'Ellyes Skhiri', 'Aïssa Laïdouni', 'Ferjani Sassi', 'Mohamed Ali Ben Romdhane', 'Foto do Time', 'Hannibal Mejbri', 'Elias Achouri', 'Elias Saad', 'Hazem Mastouri', 'Ismaël Gharbi', 'Sayfallah Ltaief', 'Naim Sliti'] },
  // GRUPO G
  { code: 'BEL', name: 'Bélgica',             iso2: 'be', group: 'G',
    players: ['Thibaut Courtois', 'Arthur Theate', 'Timothy Castagne', 'Zeno Debast', 'Brandon Mechele', 'Maxim De Cuyper', 'Thomas Meunier', 'Youri Tielemans', 'Amadou Onana', 'Nicolas Raskin', 'Alexis Saelemaekers', 'Foto do Time', 'Hans Vanaken', 'Kevin De Bruyne', 'Jérémy Doku', 'Charles De Ketelaere', 'Leandro Trossard', 'Loïs Openda', 'Romelu Lukaku'] },
  { code: 'EGY', name: 'Egito',               iso2: 'eg', group: 'G',
    players: ['Mohamed Elshenawy', 'Mohamed Hany', 'Mohamed Hamdy', 'Vasser Ibrahim', 'Khaled Sobhi', 'Ramy Rabia', 'Hossam Abdelmaguid', 'Ahmed Fatouh', 'Marwan Attia', 'Zizo', 'Hamdy Fathy', 'Foto do Time', 'Mohanad Lasheen', 'Emam Ashour', 'Osama Faisal', 'Mohamed Salah', 'Mostafa Mohamed', 'Trezeguet', 'Omar Marmoush'] },
  { code: 'IRN', name: 'Irã',                 iso2: 'ir', group: 'G',
    players: ['Alireza Beiranvand', 'Morteza Pouraliganji', 'Ehsan Hajsafi', 'Milad Mohammadi', 'Shojae Khalilzadeh', 'Ramin Rezaeian', 'Hossein Kanaani', 'Sadegh Moharrami', 'Saleh Hardani', 'Saeed Ezatolahi', 'Saman Ghoddos', 'Foto do Time', 'Omid Noorafkan', 'Roozbeh Cheshmi', 'Mohammad Mohebi', 'Sardar Azmoun', 'Mehdi Taremi', 'Alireza Jahanbakhsh', 'Ali Gholizadeh'] },
  { code: 'NZL', name: 'Nova Zelândia',       iso2: 'nz', group: 'G',
    players: ['Max Crocombe', 'Alex Paulsen', 'Michael Boxall', 'Liberato Cacace', 'Tim Payne', 'Tyler Bindon', 'Francis De Vries', 'Finn Surman', 'Joe Bell', 'Sarpreet Singh', 'Ryan Thomas', 'Foto do Time', 'Matthew Garbett', 'Marko Stamenić', 'Ben Old', 'Chris Wood', 'Elijah Just', 'Callum McCowatt', 'Kosta Barbarouses'] },
  // GRUPO H
  { code: 'ESP', name: 'Espanha',             iso2: 'es', group: 'H',
    players: ['Unai Simón', 'Robin Le Normand', 'Aymeric Laporte', 'Dean Huijsen', 'Pedro Porro', 'Dani Carvajal', 'Marc Cucurella', 'Martín Zubimendi', 'Rodri', 'Pedri', 'Fabián Ruiz', 'Foto do Time', 'Mikel Merino', 'Lamine Yamal', 'Dani Olmo', 'Nico Williams', 'Ferran Torres', 'Álvaro Morata', 'Mikel Oyarzabal'] },
  { code: 'CPV', name: 'Cabo Verde',          iso2: 'cv', group: 'H',
    players: ['Vozinha', 'Logan Costa', 'Pico', 'Dinev', 'Steven Moreira', 'Wagner Pina', 'João Paulo', 'Vannick Semedo', 'Kevin Pina', 'Patrick Andrade', 'Jamiro Monteiro', 'Foto do Time', 'Deroy Duarte', 'Garry Rodrigues', 'Jovane Cabral', 'Ryan Mendes', 'Dailon Livramento', 'Willy Semedo', 'Bébé'] },
  { code: 'KSA', name: 'Arábia Saudita',      iso2: 'sa', group: 'H',
    players: ['Nawaf Alaqidi', 'Abdulrahman Alsanbi', 'Saud Abdulhamid', 'Nawaf Buwashl', 'Jehad Thikri', 'Moteb Alharbi', 'Hassan Altambakti', 'Musab Aljuwayr', 'Ziyad Aljohani', 'Abdullah Alkhaibari', 'Nasser Aldawsari', 'Foto do Time', 'Saleh Abu Alshamat', 'Marwan Alsahafi', 'Salem Aldawsari', 'Abdulrahman Alobud', 'Feras Albrikan', 'Saleh Alshehri', 'Abdullah Alhamdan'] },
  { code: 'URU', name: 'Uruguai',             iso2: 'uy', group: 'H',
    players: ['Sergio Rochet', 'Santiago Mele', 'Ronald Araújo', 'José María Giménez', 'Sebastián Cáceres', 'Mathías Olivera', 'Guillermo Varela', 'Nahitán Nández', 'Federico Valverde', 'Giorgian De Arrascaeta', 'Rodrigo Bentancur', 'Foto do Time', 'Manuel Ugarte', 'Nicolás De La Cruz', 'Maxi Araújo', 'Darwin Núñez', 'Federico Viñas', 'Rodrigo Aguirre', 'Facundo Pellistri'] },
  // GRUPO I
  { code: 'FRA', name: 'França',              iso2: 'fr', group: 'I',
    players: ['Mike Maignan', 'Théo Hernández', 'William Saliba', 'Jules Koundé', 'Ibrahima Konaté', 'Dayot Upamecano', 'Lucas Digne', 'Aurélien Tchouaméni', 'Eduardo Camavinga', 'Manu Koné', 'Adrien Rabiot', 'Foto do Time', 'Michael Olise', 'Ousmane Dembélé', 'Bradley Barcola', 'Désiré Doué', 'Kingsley Coman', 'Hugo Ekitiké', 'Kylian Mbappé'] },
  { code: 'SEN', name: 'Senegal',             iso2: 'sn', group: 'I',
    players: ['Édouard Mendy', 'Yehvann Diouf', 'Moussa Niakhaté', 'Abdoulaye Seck', 'Ismail Jakobs', 'El Hadji Malick Diouf', 'Kalidou Koulibaly', 'Idrissa Gana Guèye', 'Pape Matar Sarr', 'Pape Guèye', 'Habib Diarra', 'Foto do Time', 'Lamine Camara', 'Sadio Mané', 'Ismaïla Sarr', 'Boulaye Dia', 'Iliman Ndiaye', 'Nicolas Jackson', 'Krepin Diatta'] },
  { code: 'IRQ', name: 'Iraque',              iso2: 'iq', group: 'I',
    players: ['Jalal Hassan', 'Rebin Sulaka', 'Hussein Ali', 'Akam Hashem', 'Merchas Doski', 'Zaid Tahseen', 'Manaf Younis', 'Zidane Iqbal', 'Amir Al-Ammari', 'Ibrahim Bavesh', 'Ali Jasim', 'Foto do Time', 'Youssef Amyn', 'Aimar Sher', 'Marko Farji', 'Osama Rashid', 'Ali Al-Hamadi', 'Aymen Hussein', 'Mohanad Ali'] },
  { code: 'NOR', name: 'Noruega',             iso2: 'no', group: 'I',
    players: ['Ørjan Nyland', 'Julian Ryerson', 'Leo Ostigård', 'Kristoffer Vassbakk Ajer', 'Marcus Holmgren Pedersen', 'David Møller Wolfe', 'Torbjørn Heggem', 'Morten Thorsby', 'Martin Ødegaard', 'Sander Berge', 'Andreas Schjelderup', 'Foto do Time', 'Patrick Berg', 'Erling Haaland', 'Alexander Sørloth', 'Aron Dønnum', 'Jørgen Strand Larsen', 'Antonio Nusa', 'Oscar Bobb'] },
  // GRUPO J
  { code: 'ARG', name: 'Argentina',           iso2: 'ar', group: 'J',
    players: ['Emiliano Martínez', 'Nahuel Molina', 'Cristian Romero', 'Nicolás Otamendi', 'Nicolás Tagliafico', 'Leonardo Balerdi', 'Enzo Fernández', 'Alexis Mac Allister', 'Rodrigo De Paul', 'Exequiel Palacios', 'Leandro Paredes', 'Foto do Time', 'Nico Paz', 'Franco Mastantuono', 'Nico González', 'Lionel Messi', 'Lautaro Martínez', 'Julián Álvarez', 'Giuliano Simeone'] },
  { code: 'ALG', name: 'Argélia',             iso2: 'dz', group: 'J',
    players: ['Alexis Guendouz', 'Ramy Bensebaini', 'Youcef Atal', 'Rayan Aït-Nouri', 'Mohamed Amine Tougai', 'Aïssa Mandi', 'Ismaël Bennacer', 'Houssem Aouar', 'Hicham Boudaoui', 'Ramiz Zerrouki', 'Nabil Bentaleb', 'Foto do Time', 'Farès Chaibi', 'Riyad Mahrez', 'Saïd Benrahma', 'Anis Hadj Moussa', 'Amine Gouiri', 'Baghdad Bounedjah', 'Mohammed Amoura'] },
  { code: 'AUT', name: 'Áustria',             iso2: 'at', group: 'J',
    players: ['Alexander Schlager', 'Patrick Pentz', 'David Alaba', 'Kevin Danso', 'Philipp Lienhart', 'Stefan Posch', 'Phillipp Mwene', 'Alexander Prass', 'Xaver Schlager', 'Marcel Sabitzer', 'Konrad Laimer', 'Foto do Time', 'Florian Grillitsch', 'Nicolas Seiwald', 'Romano Schmid', 'Patrick Wimmer', 'Christoph Baumgartner', 'Michael Gregoritsch', 'Marko Arnautović'] },
  { code: 'JOR', name: 'Jordânia',            iso2: 'jo', group: 'J',
    players: ['Yazeed Abulaila', 'Ihsan Haddad', 'Mohammad Abu Hashish', 'Yazan Al-Arab', 'Abdallah Nasib', 'Saleem Obaid', 'Mohammad Abualnadi', 'Ibrahim Saadeh', 'Nizar Al-Rashdan', 'Noor Al-Rawabdeh', 'Mohannad Abu Taha', 'Foto do Time', 'Amer Jamous', 'Mousa Al-Taamari', 'Yazan Al-Naimat', 'Mahmoud Al-Mardi', 'Ali Olwan', 'Mohammad Abu Zrayq', 'Ibrahim Sabra'] },
  // GRUPO K — página 90: POR, COD, UZB, COL
  { code: 'POR', name: 'Portugal',            iso2: 'pt', group: 'K',
    players: ['Diogo Costa', 'José Sá', 'Rúben Dias', 'João Cancelo', 'Diogo Dalot', 'Nuno Mendes', 'Gonçalo Inácio', 'Bernardo Silva', 'Bruno Fernandes', 'Rúben Neves', 'Vitinha', 'Foto do Time', 'João Neves', 'Cristiano Ronaldo', 'Francisco Trincão', 'João Félix', 'Gonçalo Ramos', 'Pedro Neto', 'Rafael Leão'] },
  { code: 'COD', name: 'Congo DR',            iso2: 'cd', group: 'K',
    players: ['Lionel Mpasi', 'Aaron Wan-Bissaka', 'Axel Tuanzebe', 'Arthur Masuaku', 'Chancel Mbemba', 'Joris Kavembe', 'Charles Pickel', 'Ngalavel Mukau', 'Edo Kavembe', 'Samuel Moutoussamy', 'Noah Sadiki', 'Foto do Time', 'Théo Bongonda', 'Meschack Elia', 'Yoane Wissa', 'Brian Cipenga', 'Fiston Mavele', 'Cédric Bakambu', 'Nathanaël Mbuku'] },
  { code: 'UZB', name: 'Uzbequistão',         iso2: 'uz', group: 'K',
    players: ['Utkir Yusupov', 'Farrukh Sayfiev', 'Sherzod Nasrullaev', 'Umar Eshmurodov', 'Husniddin Alidulov', 'Rustam Ashurmatov', 'Khojabkar Alijonov', 'Abdukodir Khusanov', 'Odiljon Hamrobekov', 'Otabek Shukurov', 'Jamshid Iskanderov', 'Foto do Time', 'Azizbek Turgunboev', 'Khojimat Erkinov', 'Eldor Shomurodov', 'Doniyor Urunov', 'Jaloliddin Masharipov', 'Igor Sergeev', 'Abbosbek Fayzullaev'] },
  { code: 'COL', name: 'Colômbia',            iso2: 'co', group: 'K',
    players: ['Camilo Vargas', 'David Ospina', 'Dávinson Sánchez', 'Yerry Mina', 'Daniel Muñoz', 'Johan Mojica', 'Jhon Lucumí', 'Santiago Arias', 'Jefferson Lerma', 'Kevin Castaño', 'Richard Ríos', 'Foto do Time', 'James Rodríguez', 'Juan Fernando Quintero', 'Jorge Carrascal', 'Jhon Arias', 'Jhon Córdoba', 'Luis Suárez', 'Luis Díaz'] },
  // GRUPO L — página 98: ENG, CRO, GHA, PAN
  { code: 'ENG', name: 'Inglaterra',          iso2: 'gb-eng', group: 'L',
    players: ['Jordan Pickford','John Stones','Marc Guéhi','Ezri Konsa','Trent Alexander-Arnold','Reece James','Dan Burn','Jordan Henderson','Declan Rice','Jude Bellingham','Cole Palmer','Foto do Time','Morgan Rogers','Anthony Gordon','Phil Foden','Bukayo Saka','Harry Kane','Marcus Rashford','Ollie Watkins'] },
  { code: 'CRO', name: 'Croácia',             iso2: 'hr', group: 'L',
    players: ['Dominik Livaković', 'Duje Ćaleta-Car', 'Joško Gvardiol', 'Josip Stanišić', 'Luka Vušković', 'Josip Šutalo', 'Kristijan Jakić', 'Luka Modrić', 'Mateo Kovačić', 'Martin Baturina', 'Lovro Majer', 'Foto do Time', 'Mario Pašalić', 'Petar Sučić', 'Ivan Perišić', 'Marco Pašalić', 'Ante Budimir', 'Andrej Kramarić', 'Franjo Ivanović'] },
  { code: 'GHA', name: 'Gana',                iso2: 'gh', group: 'L',
    players: ['Lawrence Ati Zigi', 'Tariq Lamptey', 'Mohammed Salisu', 'Alidu Seidu', 'Alexander Djiku', 'Gideon Mensah', 'Caleb Virenkyi', 'Abdul Issahaku Fatawu', 'Thomas Partey', 'Salis Abdul Samed', 'Kamaldeen Sulemana', 'Foto do Time', 'Mohammed Kudus', 'Iñaki Williams', 'Jordan Ayew', 'André Ayew', 'Joseph Paintsil', 'Osman Bukari', 'Antoine Semenyo'] },
  { code: 'PAN', name: 'Panamá',              iso2: 'pa', group: 'L',
    players: ['Orlando Mosquera', 'Luis Mejía', 'Fidel Escobar', 'Andrés Andrade', 'Michael Amir Murillo', 'Eric Davis', 'José Córdoba', 'César Blackman', 'Cristian Martínez', 'Aníbal Godoy', 'Adalberto Carrasquilla', 'Foto do Time', 'Edgar Bárcenas', 'Carlos Harvey', 'Ismael Díaz', 'José Fajardo', 'Cecilio Waterman', 'José Luis Rodríguez', 'Alberto Quintero'] },
]

export function buildStickersFromTeams() {
  const stickers = []
  TEAMS.forEach(team => {
    // posição 1 = escudo (especial/foil)
    stickers.push({ code: `${team.code}1`, name: 'Escudo', special: true, team: team.code, num: 1 })
    team.players.forEach((player, i) => {
      const num = i + 2
      const isPhoto = player === 'Foto do Time'
      stickers.push({ code: `${team.code}${num}`, name: player, special: isPhoto, team: team.code, num })
    })
  })
  return stickers
}

export function buildSpecialStickers() {
  const stickers = []
  SPECIAL_SECTIONS.forEach(section => {
    section.stickers.forEach(s => {
      stickers.push({ ...s, team: section.code })
    })
  })
  return stickers
}
