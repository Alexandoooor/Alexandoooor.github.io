---
layout: post
title:  "Rolling custom QMK firmware for my Keychron keyboard"
author: Alexander
tags: firmware QMK Keyboard
---

I'm using a Keychron Q1 Max as my preferred keyboard. It is a really nice keyboard.
It's built like a tank, it feels nice to type on and it is wireless with 1000 Hz polling rate,
while maintaining great battery-life.

But one of the best features is that it runs [QMK Firmware](https://qmk.fm):
>QMK Firmware: Open-source keyboard firmware for Atmel AVR and Arm USB families.

### Why the need for QMK?
One thing that I do on every computer that I use is to rebind `caps` to act as `esc` on tap and `ctrl` on hold.
One option is to do it on a software-level, But that works differently on every OS and sometimes requires installing third-party software.
Another potential problem is that remote machines might not recognize the host machine-rebinds either, which can be annoying if you're often using VMs.

Remember, QMK is the firmware running on the keyboard. This means that you won't have to figure out how to rebind keys on each computer that you use, your keyboard will work in the same way on any computer.

QMK allows you to configure a key with a key-type called [Mod-Tap key](https://docs.qmk.fm/mod_tap).
>The Mod-Tap key MT(mod, kc) acts like a modifier when held, and a regular keycode when tapped. In other words, you can have a key that sends Escape when you tap it, but functions as a Control or Shift key when you hold it down.

Binding `caps` to `MT(MOD_LCTL, KC_ESC)` does exactly what I want! This modification can even be done in the Keychron Launcher which is a web application that allows you to use a GUI to customize your keyboard. Easy peasy, right?

### Why the need to roll custom firmware then?
Well the Keychron Launcher also allows you to install the latest firmware updates provided by Keychron. Diligent as I am, I decided to flash the latest available firmware.

*This turned out to be a mistake.*

After flashing the updated firmware the timing deciding whether an action is a `tap` or a `hold`.
This caused me to constantly make mistakes. Most commonly when cycling between `tmux`-panes using `ctrl-A p/n` (previous and next pane respectively).
This was incredibly annoying.

### Rolling custom firmware
After some research, I found that the QMK documentation has a page on [Tap-Hold Configuration Options](https://docs.qmk.fm/tap_hold#tap-or-hold-decision-modes).
There is the [tapping-term](https://docs.qmk.fm/tap_hold#tapping-term)-option, which controls how long you need to hold the key before it is interpeted as a `hold`. There is also an option for different [Tap-Or-Hold Decision Modes](https://docs.qmk.fm/tap_hold#tap-or-hold-decision-modes).

Keychron has a public [repository](https://github.com/Keychron/qmk_firmware/tree/wireless_playground) of their QMK-fork, which includes firmware for my keyboard, the Keychron Q1 Max.

I could it up for use with the QMK-cli by running the following command:
```bash
qmk setup -H ~/qmk_firmware -b wireless_playground Keychron/qmk_firmware
```

The relevant files for me are located here:
```bash
qmk_firmware/keyboards/keychron/q1_max/ansi_encoder/config.h
qmk_firmware/keyboards/keychron/q1_max/ansi_encoder/keymaps/via/keymap.c
```

### Performing modifications
Referencing the documentation I added the following options to the `config.h` file.
```c
#define TAPPING_TERM 200
#define HOLD_ON_OTHER_KEY_PRESS
```

As mentioned before, tapping term controls how long you need to hold the key pressed for it to be interpeted as `hold`.

Hold on other key press works as follows:
>The "hold on other key press" mode can be enabled for all dual-role keys.
This mode makes tap and hold keys (like Mod-Tap) work better for fast typists, or for high TAPPING_TERM settings.
If you press a dual-role key, press another key, and then release the dual-role key, all within the tapping term, by default the dual-role key will perform its tap action. If the HOLD_ON_OTHER_KEY_PRESS option is enabled, the dual-role key will perform its hold action instead.

I replaced `KC_ESC` with `MT(MOD_LCTL, KC_ESC)` in `keymap.c` to enable the Mod-Tap behavior.

### Building and flashing the custom firmware
Time to compile the firmware!

```bash
qmk compile -kb keychron/q1_max/ansi_encoder -km via
```

After compiling I connected my keyboard to my computer over USB while holding `Esc` and then I flashed the firmware using QMK toolbox.

Et voilà, my keyboard behaves as expected!
