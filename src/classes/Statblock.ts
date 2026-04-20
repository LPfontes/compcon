import { Pilot, Mech, PilotWeapon, MechWeapon } from '../class'
import { Unit } from './npc/unit/Unit'
import { i18n } from '../locales/i18n'

function linebreak(i: number, length: number): string {
  if (i > 0 && (i + 1) % 2 === 0 && i + 1 !== length) {
    return ',\n  '
  } else if (i + 1 < length) {
    return ', '
  } else {
    return '\n'
  }
}

function addWeaponToOutput(output: string, discordEmoji: boolean, w: MechWeapon | null): string {
  if (w) output += `${w.TrueName}`
  if (w && discordEmoji) {
    if (w.Range) {
      const ranges: string[] = []
      w.Range.forEach(r => {
        ranges.push(`${r.DiscordEmoji} ${r.Value}`)
      })
      output += ` ${ranges.join(' ')}`
    }
    if (w.Damage) {
      const damages: string[] = []
      w.Damage.forEach(d => {
        damages.push(`${d.DiscordEmoji} ${d.Value}`)
      })
      output += ` ${damages.join(' ')}`
    }
  }

  return output
}

class Statblock {
  public static Generate(pilot: Pilot, mech: Mech, discordEmoji: boolean, view: string): string {
    let output = ''
    const t = (key: string, args?: any) => (i18n.global as any).t(`pilotSheet.statblock.generated.${key}`, args)

    if (view === 'pilotBuild' || view === 'full') {
      output += `» ${pilot.Name} // ${pilot.Callsign.toUpperCase()} «\n  `
      if (pilot.Background) {
        output += `${pilot.Background}, `
      }
      output += `LL${pilot.Level}\n`
      output += `[ ${t('skillTriggers')} ]\n  `
      for (let i = 0; i < pilot.SkillsController.Skills.length; i++) {
        const s = pilot.SkillsController.Skills[i]
        output += `${s.Skill.Trigger} (+${s.Bonus})${linebreak(
          i,
          pilot.SkillsController.Skills.length
        )}`
      }

      const loadout = pilot.PilotLoadoutController.ActiveLoadout
      if (loadout) {
        output += `[ ${t('gear')} ]\n  `
        for (let i = 0; i < loadout.Items.length; i++) {
          if (loadout.Items[i]) {
            if (discordEmoji) {
              const weapon = loadout.Items[i] as PilotWeapon
              let str = weapon.TrueName
              if ('Range' in weapon) {
                const ranges: string[] = []
                weapon.Range.forEach(r => {
                  ranges.push(`${r.DiscordEmoji} ${r.Value}`)
                })
                str += ` ${ranges.join(' ')}`
              }
              if ('Damage' in weapon) {
                const damages: string[] = []
                weapon.Damage.forEach(d => {
                  damages.push(`${d.DiscordEmoji} ${d.Value}`)
                })
                str += ` ${damages.join(' ')}`
                output += `${str}${linebreak(i, loadout.Items.length)}`
              }
            } else output += `${loadout.Items[i].TrueName}${linebreak(i, loadout.Items.length)}`
          }
        }
      }

      const bond = pilot.BondController
      if (bond.Bond) {
        output += `[ ${t('bond')} ]\n  `
        output += `${bond.Bond.Name.toUpperCase()}\n`
        if (bond.BondPowers) {
          output += `  ${t('powers')}: `
          for (let i = 0; i < bond.BondPowers.length; i++) {
            output += `${bond.BondPowers[i].name.toUpperCase()}${linebreak(
              i,
              bond.BondPowers.length
            )}`
          }
        }
        output += '\n'
      }

      if (view === 'pilotBuild') {
        output += `[ ${t('mechSkills')} ]\n  `
        output += `${t('grit')}:${pilot.Grit} // H:${pilot.MechSkillsController.MechSkills.Hull} A:${pilot.MechSkillsController.MechSkills.Agi} S:${pilot.MechSkillsController.MechSkills.Sys} E:${pilot.MechSkillsController.MechSkills.Eng}\n`
      }
      output += `[ ${t('talents')} ]\n  `
      for (let i = 0; i < pilot.TalentsController.Talents.length; i++) {
        const t = pilot.TalentsController.Talents[i]
        output += `${t.Talent.Name} ${t.Rank}${linebreak(
          i,
          pilot.TalentsController.Talents.length
        )}`
      }

      if (pilot.LicenseController.Licenses.length) {
        output += `[ ${t('licenses')} ]\n  `
        for (let i = 0; i < pilot.LicenseController.Licenses.length; i++) {
          const l = pilot.LicenseController.Licenses[i]

          if (l.License)
            output += `${l.License.Source} ${l.License.Name} ${l.Rank}${linebreak(
              i,
              pilot.LicenseController.Licenses.length
            )}`
          else if (l.Stub)
            output += `${l.Stub.Source} ${l.Stub.Name}${linebreak(i, pilot.LicenseController.Licenses.length)}`
        }
      }

      if (pilot.CoreBonusController.CoreBonuses.length) {
        output += `[ ${t('coreBonuses')} ]\n  `
        for (let i = 0; i < pilot.CoreBonusController.CoreBonuses.length; i++) {
          const cb = pilot.CoreBonusController.CoreBonuses[i]
          output += `${cb.Name}${linebreak(i, pilot.CoreBonusController.CoreBonuses.length)}`
        }
      }
    }

    if (mech) {
      if (view === 'full') {
        output += `[ ${t('mech')} ]\n  « ${mech.Name.toUpperCase()} »\n  ${mech.Frame.Source} ${
          mech.Frame.Name
        }\n`
        output += `  H:${mech.Hull} A:${mech.Agi} S:${mech.Sys} E:${mech.Eng} ${t('size')}:${mech.Size}\n`
        output += `  ${t('structure')}:${mech.MaxStructure}`
        output += ` ${t('hp')}:${mech.MaxHP}`
        output += ` ${t('armor')}:${mech.Armor}\n`
        output += `  ${t('stress')}:${mech.MaxStress}`
        output += ` ${t('heat')}:${mech.HeatCapacity}}`
        output += ` ${t('repair')}:${mech.RepairCapacity}\n`
        output += `  ${t('atkBonus')}:${mech.AttackBonus} ${t('techAtk')}:${mech.TechAttack} ${t('ltdBonus')}:${mech.LimitedBonus}\n`
        output += `  ${t('spd')}:${mech.Speed} ${t('eva')}:${mech.Evasion} ${t('edef')}:${mech.EDefense} ${t('sens')}:${mech.SensorRange} ${t('save')}:${mech.SaveTarget}\n`

        output += `[ ${t('weapons')} ]\n`
        for (const im of mech.MechLoadoutController.ActiveLoadout.IntegratedMounts) {
          for (const mw of im.Weapons) {
            output += `  ${t('integratedMount')}: `
            output = addWeaponToOutput(output, discordEmoji, mw)
            output += '\n'
          }
        }
        const loadout = mech.MechLoadoutController.ActiveLoadout
          ? mech.MechLoadoutController.ActiveLoadout
          : mech.MechLoadoutController.Loadouts[0]
        if (loadout) {
          for (const mount of loadout.AllEquippableMounts(
            pilot && pilot.has('CoreBonus', 'cb_improved_armament'),
            pilot && pilot.has('CoreBonus', 'cb_integrated_weapon')
          )) {
            output += `  ${mount.Name}: `
            if (mount.IsLocked) {
              output += t('superheavyBracing')
            } else {
              mount.Weapons.forEach((w, idx) => {
                output = addWeaponToOutput(output, discordEmoji, w)
                if (w.Mod) output += ` (${w.Mod.TrueName})`
                if (idx + 1 < mount.Weapons.length) output += ' / '
              })
            }

            if (mount.Bonuses.length > 0) {
              output += ' // ' + mount.Bonuses.map(bonus => bonus.Name).join(', ')
            }

            output += '\n'
          }

          output += `[ ${t('systems')} ]\n  `
          const allsys = mech.MechLoadoutController.ActiveLoadout.IntegratedSystems.concat(
            loadout.Systems
          )
          allsys.forEach((sys, i) => {
            output += `${sys.TrueName}${linebreak(i, allsys.length)}`
          })
        }
      }
    } else if (view === 'full') {
      output += `\n>> ${t('noMechSelected')} <<`
    }
    return output
  }

  public static GenerateBuildSummary(pilot: Pilot, mech: Mech, discordEmoji: boolean): string {
    const t = (key: string, args?: any) => (i18n.global as any).t(`pilotSheet.statblock.generated.${key}`, args)
    if (mech) {
      const mechLoadout = mech.MechLoadoutController.ActiveLoadout
        ? mech.MechLoadoutController.ActiveLoadout
        : mech.MechLoadoutController.Loadouts[0]
      return `-- ${mech.Frame.Source} ${mech.Frame.Name} @ LL${pilot.Level} --
[ ${t('licenses')} ]
  ${
    pilot.LicenseController.Licenses.length
      ? `${pilot.LicenseController.Licenses.map(l => {
          if (l.License) return `${l.License.Source} ${l.License.Name} ${l.Rank}`
          else if (l.Stub) return `${l.Stub.Source} ${l.Stub.Name}`
        }).join(', ')}`
      : 'N/A'
  }
[ ${t('coreBonuses')} ]
  ${
    pilot.CoreBonusController.CoreBonuses.length
      ? `${pilot.CoreBonusController.CoreBonuses.map(cb => cb.Name).join(', ')}`
      : 'N/A'
  }
[ ${t('talents')} ]
  ${pilot.TalentsController.Talents.map(t => `${t.Talent.Name} ${t.Rank}`).join(', ')}
[ ${t('mechSkills')} ]
  HULL:${pilot.MechSkillsController.MechSkills.Hull} AGI:${
    pilot.MechSkillsController.MechSkills.Agi
  } SYS:${pilot.MechSkillsController.MechSkills.Sys} ENGI:${
    pilot.MechSkillsController.MechSkills.Eng
  }
  ${t('structure')}:${mech.MaxStructure} ${t('hp')}:${mech.MaxHP} ${t('armor')}:${mech.Armor}
  ${t('stress')}:${mech.MaxStress} ${t('heat')}:${mech.HeatCapacity} ${t('repair')}:${mech.RepairCapacity}
  ${t('techAtk')}:${mech.TechAttack > 0 ? `+${mech.TechAttack}` : mech.TechAttack} LIMITED:+${
    mech.LimitedBonus
  }
  ${t('spd')}:${mech.Speed} ${t('eva')}:${mech.Evasion} ${t('edef')}:${mech.EDefense} ${t('sens')}:${mech.SensorRange} ${t('save')}:${
    mech.SaveTarget
  }
[ ${t('weapons')} ]
  ${mech.MechLoadoutController.ActiveLoadout.IntegratedMounts.map(
    mount =>
      `Integrated: ${mount.Weapon ? mount.Weapon.TrueName : 'N/A  '}${
        discordEmoji && mount.Weapon && mount.Weapon.Range
          ? ' ' +
            mount.Weapon.Range.filter(Boolean)
              .map(r => `${r.DiscordEmoji}${r.Value}`)
              .join(' ')
          : ''
      }${
        discordEmoji && mount.Weapon && mount.Weapon.Damage
          ? ' ' +
            mount.Weapon.Damage.filter(Boolean)
              .map(d => `${d.DiscordEmoji}${d.Value}`)
              .join(' ')
          : ''
      }\n  `
  ).join('')}${mechLoadout
    .AllEquippableMounts(
      pilot.has('CoreBonus', 'cb_improved_armament'),
      pilot.has('CoreBonus', 'cb_integrated_weapon')
    )
    .map(mount => {
      let out = `${mount.Name}: `
      if (mount.IsLocked) out += t('superheavyBracing')
      else
        out += mount.Weapons.filter(Boolean)
          .map(
            weapon =>
              `${weapon.TrueName}${
                discordEmoji && weapon.Range
                  ? ' ' +
                    weapon.Range.filter(Boolean)
                      .map(r => `${r.DiscordEmoji}${r.Value}`)
                      .join(' ')
                  : ''
              }${
                discordEmoji && weapon.Damage
                  ? ' ' +
                    weapon.Damage.filter(Boolean)
                      .map(d => `${d.DiscordEmoji}${d.Value}`)
                      .join(' ')
                  : ''
              }${weapon.Mod ? ` (${weapon.Mod.TrueName})` : ''}`
          )
          .join(' / ')

      if (mount.Bonuses.length > 0)
        out += ' // ' + mount.Bonuses.map(bonus => bonus.Name).join(', ')

      return out
    })
    .join('\n  ')}
[ ${t('systems')} ]
  ${mechLoadout.Systems.map(sys => {
    let out = sys.TrueName
    if (sys.IsLimited) out += ` x${sys.getTotalUses(mech.LimitedBonus)}`
    return out
  }).join(', ')}`
    } else return `>> ${t('noMechSelected')} <<`
  }

  public static GenerateNPC(npc: Unit, includeNarrative: boolean): string {
    const t = (key: string, args?: any) => (i18n.global as any).t(`pilotSheet.statblock.generated.${key}`, args)
    let output = `// ${npc.Name} //\n`
    if (npc.NpcTemplateController.Templates)
      output += `${npc.NpcTemplateController.Templates.map(t => t.Name).join(' ')}`
    if (npc.NpcClassController.HasClass)
      output += ` ${npc.NpcClassController.Class!.Name.toUpperCase()}`
    output +=
      typeof npc.NpcClassController.Tier === 'number'
        ? `, Tier ${npc.NpcClassController.Tier} `
        : ', Custom '
    output += `${npc.Tag}\n`
    output += `[ ${t('mechSkills')} ]\n`
    output += `  H: ${npc.StatController.getMax('Hull')} | A: ${npc.StatController.getMax(
      'Agi'
    )} | S: ${npc.StatController.getMax('Sys')} | E: ${npc.StatController.getMax('Eng')}\n`
    output += `  ${t('structure')}: ${npc.StatController.getMax(
      'Structure'
    )} | ${t('armor')}: ${npc.StatController.getMax('Armor')} | ${t('hp')}: ${npc.StatController.getMax('hp')}\n`
    output += `  ${t('stress')}: ${npc.StatController.getMax(
      'Stress'
    )} | ${t('heat')}: ${npc.StatController.getMax('heat')} | ${t('spd')}: ${npc.StatController.getMax(
      'Speed'
    )}\n`
    output += `  ${t('save')}: ${npc.StatController.getMax(
      'SaveTarget'
    )} | ${t('eva')}: ${npc.StatController.getMax('Evasion')} | ${t('edef')}: ${npc.StatController.getMax(
      'EDefense'
    )}\n`
    output += `  ${t('sens')}: ${npc.StatController.getMax(
      'SensorRange'
    )} | ${t('size')}: ${npc.StatController.getMax('Size')} | ACT: ${npc.StatController.getMax(
      'Activations'
    )}\n`
    output += '[ FEATURES ]\n  '
    output += npc.NpcFeatureController.Features.map(
      (item, index) => `${item.Name}${linebreak(index, npc.NpcFeatureController.Features.length)}`
    ).join('')

    if (includeNarrative) {
      output += this.generateNarrativeBlock(npc)
    }

    return output
  }

  public static ScanNpc(npc: Unit): string {
    const t = (key: string, args?: any) => (i18n.global as any).t(`pilotSheet.statblock.generated.${key}`, args)
    let output = `[ ${npc.Name} ]\n`
    if (npc.NpcTemplateController.Templates)
      output += `${npc.NpcTemplateController.Templates.map(t => t.Name).join(' ')}`
    if (npc.NpcClassController.HasClass)
      output += `${npc.NpcClassController.Class!.Name.toUpperCase()}`
    output +=
      typeof npc.NpcClassController.Tier === 'number'
        ? `, Tier ${npc.NpcClassController.Tier} `
        : ', Custom '
    output += `${npc.Tag}\n\n`
    output += `ACTIVATIONS: ${npc.StatController.getCurrent('activations')} / ${npc.StatController.getMax('activations')}\n`

    output += `${t('structure')}: ${npc.StatController.getCurrent('structure')} / ${npc.StatController.getMax('structure')} | ${t('armor')}: ${npc.StatController.getMax('armor')} | ${t('hp')}: ${npc.StatController.getCurrent('hp')} / ${npc.StatController.getMax('hp')}\n`
    output += `${t('stress')}: ${npc.StatController.getCurrent('stress')} / ${npc.StatController.getMax('stress')} | ${t('heat')}: ${npc.StatController.getCurrent('heat')} / ${npc.StatController.getMax('heat')} | ${t('spd')}: ${npc.StatController.getCurrent('speed')} / ${npc.StatController.getMax('speed')}\n\n`

    output += `H: ${npc.StatController.getMax('Hull')} | A: ${npc.StatController.getMax(
      'Agi'
    )} | S: ${npc.StatController.getMax('Sys')} | E: ${npc.StatController.getMax('Eng')}\n`
    output += `${t('save')}: ${npc.StatController.getMax(
      'SaveTarget'
    )} | ${t('eva')}: ${npc.StatController.getMax('Evasion')} | ${t('edef')}: ${npc.StatController.getMax(
      'EDefense'
    )}\n`
    output += `${t('sens')}: ${npc.StatController.getMax(
      'SensorRange'
    )} | TECH_ATK: ${npc.StatController.getMax('Tech Attack')} | ${t('size')}: ${npc.StatController.getMax('Size')} \n\n`

    output += '[ FEATURES ]\n  '
    output += npc.NpcFeatureController.Features.map(
      (item, index) => `${item.Name}${linebreak(index, npc.NpcFeatureController.Features.length)}`
    ).join('')

    return output
  }

  public static generateNarrativeBlock(npc: Unit): string {
    let output = ''
    if (npc.NarrativeController.TextItems.length > 0) {
      output += '[ ADDITIONAL DETAIL ]\n'
      npc.NarrativeController.TextItems.forEach(item => {
        output += `  ${item.title || (item as any).header}\n   ${item.body.replace(
          /<[^>]*>/gi,
          ''
        )}\n`
      })
    }
    if (npc.NarrativeController.Clocks.length > 0) {
      output += '[ CLOCKS ]\n'
      npc.NarrativeController.Clocks.forEach(clock => {
        output += `  ${clock.Title}: ${'▣'.repeat(clock.Progress)}${'▢'.repeat(
          clock.Segments - clock.Progress
        )}\n`
      })
    }
    if (npc.NarrativeController.Tables.length > 0) {
      output += '[ TABLES ]\n'
      npc.NarrativeController.Tables.forEach(table => {
        output += `  ${table.Title} (${table.Mult}D${table.Die})\n`
        table.Results.forEach(result => {
          output += `    ${result.min} - ${result.max}: ${result.result}\n`
        })
      })
    }
    return output
  }
}

export default Statblock
